# quizbot
A telegram bot to create quizzes.

# Features
- Get user informations (Customizable fields and messages) 
- Create multiple quizzes with multiple-choice options and show them in Telegram
- Manage quizzes and results in Wordpress (Uses a quiz plugin in Wordpress)

# Installation
1. Install a [Wordpress](https://wordpress.org) and [Quiz And Survey Master](https://wordpress.org/plugins/quiz-master-next/) plugin.
2. Upload `wordpress-files/quiz-functions.php` to `wp-content/mu-plugins` folder of wordpress. 
3. Install & run [Redis](https://redis.io/topics/quickstart). Also make sure Redis is on server boot by `redis-cli startup`.
4. `npm i`
5. Set your configs (bot token, base domain, ...) in `config.js`
6. Run `node index.js`

Now send /start to your bot.

### Note
In "Quiz And Survey Master" plugin you should enable phone, company and mobile fields in order to recieve these data from bot. (Create a quiz, Go to options tab and enable those fields).

---

# TODO
- Show quiz description
- Make signup optional by a config
- Add main keyboard
- Use question points and some other features of wp plugin
