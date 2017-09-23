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
  // NOTE: Max 3 fields
  user_required_fields: ["fullname", "natcode", "mobile"],
  prevent_duplicate_answers: false,
  registeration_messages: {
    fullname: ["Please enter your full name:", null, ""],
    natcode: ["Please enter your natianal code:", /^(\d{10}|[۱۲۳۴۵۶۷۸۹۰]{10})$/, "Should be 10 digits without dashes."],
    mobile: ["Please enter your mobile number:", /^(09\d{9}|۰۹[۱۲۳۴۵۶۷۸۹۰]{9})$/, "Should be something like this: 09121111111"]
  },
  messages: {
    answer_sent: "Your answers recieved. Thanks.",
    select_quiz: "Please select a quiz:",
    no_question: "There is no questions yet.",
    cant_send: "Something went wrong.",
    prevent_duplicate_answers: "You can't answer a quiz twice."
  }
};

export default config;