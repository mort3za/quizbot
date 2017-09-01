"use strict";

import qs from "qs";
import config from "../config.js";
import redis from "redis";
import Quiz from "./quiz.js";

const bot = config.bot;
const redisClient = redis.createClient();

const Question = {
  getAnUnanswered: getAnUnanswered,
  showAnUnanswered: showAnUnanswered,
  answer: answer,
  handleAnswer: handleAnswer
};

function getAnUnanswered({chatId}) {
  return new Promise((resolve, reject) => {
    redisClient.get(`${chatId}-questions`, (err, reply) => {
      let questions = JSON.parse(reply);
      const question = questions.find(item => !item.user_answer);
      const keyboard = question.answer_array.reduce((prev, current, index) => {
        return [
          ...prev,
          [
            {
              text: current[0],
              callback_data: qs.stringify({
                action: "answer_question",
                quiz_id: question.quiz_id,
                question_id: question.question_id,
                answer_id: index
              })
            }
          ]
        ];
      }, []);

      const opts = {
        reply_markup: JSON.stringify({
          inline_keyboard: keyboard
        })
      };

      resolve({question: question, options: opts});
    });
  });
}

function showAnUnanswered(chatId) {
  getAnUnanswered({chatId: chatId}).then(
    res => {
      bot.sendMessage(chatId, res.question.question_name, res.options);
    },
    error => {
      console.error(error.message);
    }
  );
}

function answer(chatId, quiz_id, question_id, answer_id) {
  return new Promise((resolve, reject) => {
    Quiz.isLocked(chatId, quiz_id).then(isLocked => {
      if (isLocked) {
        resolve({status: "locked"});
        return;
      }

      getUserQuestions(chatId)
        .then(saveQuestions)
        .then(questions => {
          return Quiz.send(chatId, quiz_id, questions);
        })
        .then(result => resolve(result));
    });
  });

  function saveQuestions(questions) {
    return new Promise((resolve, reject) => {
      let question = questions.find(item => item.question_id == question_id);
      let questionPosition = questions.findIndex(item => item.question_id == question_id);
      question.user_answer = answer_id;
      questions[questionPosition] = question;
      redisClient.set(`${chatId}-questions`, JSON.stringify(questions));
      resolve(questions);
    });
  }

  function getUserQuestions(chatId) {
    return new Promise((resolve, reject) => {
      redisClient.get(`${chatId}-questions`, (err, reply) => {
        try {
          resolve(JSON.parse(reply));
        } catch (error) {
          reject(error);
        }
      });
    });
  }
}

function handleAnswer(chatId, json) {
  Question.answer(chatId, json.quiz_id, json.question_id, json.answer_id).then(
    res => {
      console.log("res", res);
      switch (res.status) {
        case "success":
          bot.sendMessage(chatId, "Thank you!");
          break;
        case "fail":
          bot.sendMessage(chatId, config.messages.cant_send);
          break;
        case "incomplete":
          Question.showAnUnanswered(chatId);
          break;
        case "locked":
          bot.sendMessage(chatId, config.messages.prevent_duplicate_answers);
          break;
        default:
          console.error("Unknown status on answer.");
          break;
      }
    },
    error => {
      console.error(error.message);
    }
  );
}

export default Question;
