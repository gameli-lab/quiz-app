const dbClient = require('../utils/db');
const redisclient = require('../utils/redis');

class AppController {
    static async getStatus(req, res) {
        const dbAlive = dbClient.isAlive();
        const redisAlive = redisclient.isAlive();

        res.status(200).json({
            redis:redisAlive,
            db: dbAlive
        });
    }
    static async getStat(req, res) {
        try {
            const n_users = await dbClient.numUsers();
            const n_quizzes = await dbClient.numQuizzes();

            res.status(200).json({
                users: n_users,
                quizzes: n_quizzes
            });
        } catch(error) {
            console.error('Error fetching statistics:', error);
        }
    }


}

module.exports = AppController;