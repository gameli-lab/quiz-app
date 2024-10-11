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


}

module.exports = AppController;