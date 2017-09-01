"use strict";

import axios from "axios";
import config from "../config.js";
import unserialize from "locutus/php/var/unserialize";
import qs from "qs";
import redis from "redis";
import Question from "./question.js";
import Auth from "./auth.js";

const bot = config.bot;
const redisClient = redis.createClient();

const Quiz = {
  showList: showList,
  getList: getList,
  isLocked: isLocked,
  get: get,
  show: show,
  send: send,
  generateData: generateData
};

function isLocked(chatId, quiz_id) {
  return new Promise((resolve, reject) => {
    redisClient.get(`${chatId}-quiz-${quiz_id}-lock`, (err, reply) => {
      config.prevent_duplicate_answers && reply ? resolve(true) : resolve(false);
    });
  });
}

function getList() {
  const url = `${config.base_api}quizzes`;
  return axios.get(url).then(function(res) {
    return res;
  });
}

function get(quiz_id) {
  const url = `${config.base_api}quiz/${quiz_id}`;
  return axios.get(url).then(function(res) {
    let questions = res.data;
    if (!questions) return null;
    questions.map(item => {
      item.answer_array = unserialize(item.answer_array);
    });
    return {questions: questions};
  });
}

function show(chatId, json) {
  Quiz.get(json.quiz_id).then(
    res => {
      if (!res) {
        bot.sendMessage(chatId, config.messages.no_question);
      } else {
        redisClient.set(`${chatId}-questions`, JSON.stringify(res.questions));
        Question.showAnUnanswered(chatId);
      }
    },
    error => {
      console.error(error.message);
    }
  );
}

function showList(msg) {
  Quiz.getList().then(
    res => {
      const quizzes = res.data;
      const keyboard = quizzes.reduce((prev, current) => {
        return [
          ...prev,
          [
            {
              text: current.quiz_name,
              callback_data: qs.stringify({action: "get_quiz", quiz_id: current.quiz_id})
            }
          ]
        ];
      }, []);

      const opts = {
        reply_markup: JSON.stringify({
          inline_keyboard: keyboard
        })
      };
      bot.sendMessage(msg.chat.id, config.messages.select_quiz, opts);
    },
    err => {
      console.error(err.message);
    }
  );
}

function send(chatId, quiz_id, questions) {
  return new Promise((resolve, reject) => {
    if (isAllAnswered(questions)) {
      // console.log("All answered!");
      Auth.getUser(chatId).then(
        res => {
          const data = Quiz.generateData(quiz_id, questions, res.user);
          const url = `${config.base_domain}wp-admin/admin-ajax.php`;
          const req = {
            url: url,
            data: qs.stringify(data),
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          };
          axios.request(req).then(res => {
            const shouldBeInResponse = "qmn_question_answer";
            if (((res.data && res.data.display) || "").includes(shouldBeInResponse)) {
              redisClient.set(`${chatId}-quiz-${quiz_id}-lock`, "true");
              resolve({status: "success"});
            } else {
              reject({status: "fail"});
            }
          });
        },
        error => console.log(error)
      );
    } else {
      resolve({status: "incomplete", questions: questions});
    }
  });
}
function isAllAnswered(questions) {
  return questions.every(item => {
    return !!item.user_answer;
  });
}

function generateData(quiz_id, questions, user) {
  let data = {};

  questions.forEach(function(question) {
    let answerText = question.answer_array[question.user_answer][0];
    data["question" + question.question_id] = answerText;
  }, this);

  let qmn_question_list = "";
  for (var i = 0; i < questions.length; i++) {
    qmn_question_list += questions[i].question_id + "Q";
  }
  data["qmn_question_list"] = qmn_question_list;

  data["total_questions"] = questions.length.toString();
  data["timer"] = "1";
  data["qmn_quiz_id"] = quiz_id;
  data["complete_quiz"] = "confirmation";

  data["mlwUserName"] = user.fullname;
  data["mlwUserComp"] = user.natcode;
  data["mlwUserPhone"] = user.mobile;
  // data["mlwUserEmail"] = user.email;

  const result = {
    action: "qmn_process_quiz",
    quizData: qs.stringify(data)
  };
  return result;
}

export default Quiz;
