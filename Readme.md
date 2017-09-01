# Telegbot Ownar v2.0
### https://github.com/NodeRedis/node_redis
### https://github.com/yagop/node-telegram-bot-api

## Example
```
bot.sendMessage(chatId, "Welcome", {
  reply_markup: {
    // keyboard: [["Sample text", "Second sample"], ["Keyboard"], ["I'm robot"]]
    inline_keyboard: [[{text: "uno :+1:", url: "http://google.com"}]]
  }
});

// bot.sendMessage(msg.chat.id,"<b>bold</b> \n <i>italic</i> \n <em>italic with em</em> \n <a href=\"http://www.example.com/\">inline URL</a> \n <code>inline fixed-width code</code> \n <pre>pre-formatted fixed-width code block</pre>" ,{parse_mode : "HTML"});
```

## Installation
install nodejs v6.9+ and npm v5+
use dnf in centos!  
install redis (https://www.digitalocean.com/community/tutorials/how-to-install-and-use-redis)  
npm install
npm install pm2 -g
pm2 startup

## Start Server:
ssh nik@portal.ownar.io  
pm2 start ecosystem.config.json  
redis-server --daemonize yes
// ps aux | grep redis-server  => check if redis-server is running  

### development way:
nodemon server.js  

## Initialize bot in telegram  
Send command `/admin initdb` in telegram  

## See logs
see last 100 lines of log: tail -n 100 /path/to/my.log  
see logs live: pm2 monit  
see last n users in bot: /admin users n  
