# quizbot
A telegram bot to create quizzes.

# Installation
1. Install a wordpress CMS and [Quiz And Survey Master](https://wordpress.org/plugins/quiz-master-next/) plugin.
2. Upload `wordpress-files/quiz-functions.php` to `wp-content/mu-plugins` folder of wordpress. 
3. Install & run [Redis](https://redis.io/topics/quickstart). Also make sure Redis in on server boot by `redis-cli startup`.
4. `npm i`
5. Set your configs (bot token, base domain, ...) in `config.js`
6. Run `node index.js`

Now talk to bot and press `/start` ;)

---
### Note
In "Quiz And Survey Master" plugin you should enable phone, company and mobile fields in order to recieve these data from bot. (Create a quiz, Go to options tab and enable those fields)
