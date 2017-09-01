"use strict";

import "babel-polyfill";
import qs from "qs";
import Auth from "./quiz/auth.js";
import Quiz from "./quiz/quiz.js";
import Question from "./quiz/question.js";
import config from "./config.js";
import redis from "redis";

const redisClient = redis.createClient();
const bot = config.bot;

bot.onText(/\/start/, function onText(msg) {
  showQuizList(msg);
});

function showQuizList(msg) {
  const chatId = msg.chat.id;
  Auth.getUser(chatId).then(
    res => {
      Quiz.showList(msg, bot);
    },
    error => {
      console.error(error);
    }
  );
}

// NOTE: callback data should be very small, otherwise you'll see 400 error
bot.on("callback_query", msg => {
  const chatId = msg.message.chat.id;
  let json = {};
  try {
    json = qs.parse(msg.data);
  } catch (error) {
    console.error("Invalid query.");
    bot.sendMessage(chatId, "Invalid query.");
  }
  if (json.action) {
    switch (json.action) {
      case "get_quiz":
        Quiz.show(chatId, json);
        break;
      case "answer_question":
        Question.handleAnswer(chatId, json);
        break;
      default:
        console.error("Unknown callback query.");
        break;
    }
  }
});

// JUST FOR DEVELOPMENT
// ------------------------------------------
bot.onText(/\/d/, function onText(msg) {
  redisClient.del(`${msg.chat.id}-user`);
  bot.sendMessage(msg.chat.id, "User Removed.");
});

bot.onText(/\/r/, function onText(msg) {
  const chatId = msg.chat.id;

  Auth.getUser(chatId).then(
    res => {
      console.log(res.user);
    },
    error => {
      console.error(error);
    }
  );
});