"use strict";

import redis from "redis";
import config from "../config.js";

const bot = config.bot;
const redisClient = redis.createClient();

const Auth = {
  getUser: getUser,
  register: register,
  isRegistered: isRegistered
};

function getUser(chatId) {
  return new Promise((resolve, reject) => {
    redisClient.get(`${chatId}-user`, (err, reply) => {
      let {user, filledAllFieldes} = isRegistered(reply);
      // console.log("filledAllFieldes:", filledAllFieldes);
      if (!filledAllFieldes) {
        register(chatId, user).then(
          res => {
            if (res.status == "registered") {
              resolve({status: "registered", user: res.user});
            }
          },
          error => {
            console.error(error);
          }
        );
      } else {
        resolve({status: "registered", user: user});
      }
    });
  });
}

function register(chatId, incompleteUser) {
  // console.log("register...", incompleteUser);
  return new Promise((resolve, reject) => {
    getFields(incompleteUser);

    function getFields(currentUser) {
      const found = Object.entries(config.user_required_fields).find(([key, field]) => {
        return !currentUser[field];
      });
      // console.log('found', found);
      const incompleteField = found && found[1];
      if (!incompleteField) {
        // console.log("resolve registered", currentUser);
        resolve({status: "registered", user: currentUser});
        return;
      }

      const opts = {
        reply_markup: JSON.stringify({
          force_reply: true
        })
      };
      bot.sendMessage(chatId, config.registeration_messages[incompleteField], opts).then(res => {
        let listenerId = bot.onReplyToMessage(chatId, res.message_id, onReply);

        function onReply({text}) {
          bot.removeReplyListener(listenerId);

          let newFieldOfUser = {[incompleteField]: text};
          saveUser(chatId, newFieldOfUser).then(user => {
            getFields(user);
          });
        }
      });
    }
  });
}

function isRegistered(reply) {
  let user,
    filledAllFieldes = false;
  try {
    user = JSON.parse(reply);
    filledAllFieldes = Object.entries(config.user_required_fields).every(([key, field]) => {
      return !!user[field];
    });
  } catch (error) {
    // 
  }
  // console.log({filledAllFieldes: filledAllFieldes, user: user});
  return {filledAllFieldes: filledAllFieldes, user: user || {}};
}

function saveUser(chatId, user) {
  return new Promise((resolve, reject) => {
    redisClient.get(`${chatId}-user`, (err, reply) => {
      let currentUser;
      try {
        currentUser = JSON.parse(reply);
        let newUser = Object.assign({}, currentUser, user);
        redisClient.set(`${chatId}-user`, JSON.stringify(newUser));
        resolve(newUser);
      } catch (error) {
        currentUser = {};
        reject("Can't save user");
      }
    });
  });
}

export default Auth;
