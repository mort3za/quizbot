# quizbot
A telegram bot to create quizzes.

# Features
- Get user informations (Customizable fields)
- Supports multiple quizzes
- Questions can have 2 or more items
- Uses glassy buttons of Telegram
- Manage quizzes and results in Wordpress (Uses a quiz plugin in Wordpress)

# Installation
1. Install a [Wordpress](https://wordpress.org) and [Quiz And Survey Master](https://wordpress.org/plugins/quiz-master-next/) plugin.
2. Upload `wordpress-files/quiz-functions.php` to `wp-content/mu-plugins` folder of wordpress. 
3. Install & run [Redis](https://redis.io/topics/quickstart). Also make sure Redis in on server boot by `redis-cli startup`.
4. `npm i`
5. Set your configs (bot token, base domain, ...) in `config.js`
6. Run `node index.js`

Now talk to bot and press `/start` ;)

### Note
In "Quiz And Survey Master" plugin you should enable phone, company and mobile fields in order to recieve these data from bot. (Create a quiz, Go to options tab and enable those fields).

---

# TODO
- Make signup optional by a config
- Add main keyboard
- Use question points of wp plugin
- Your ideas!