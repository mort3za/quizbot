"use strict";

import TelegramBot from "node-telegram-bot-api";

const token = "xxxxxxx:xxxxxxx-xxxxxxxx";
const base_domain = "http://your-example-api.com/";
const base_api = `${base_domain}wp-json/quiz/v1/`;
const bot = new TelegramBot(token, {polling: true});

let config = {
  bot: bot,
  token: token,
  base_api: base_api,
  base_domain: base_domain,
  user_required_fields: ["fullname", "natcode", "mobile"],
  prevent_duplicate_answers: true,
  registeration_messages: {
    fullname: "Please enter your full name",
    natcode: "Please enter your natianal code",
    mobile: "Please enter your mobile number"
  },
  messages: {
    select_quiz: "Please select a quiz:",
    no_question: "No questions found.",
    cant_send: "Sorry! A problem occured in sending data.",
    prevent_duplicate_answers: "Sorry. You can't answer twice."
  }
};

export default config;
