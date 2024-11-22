const redis = require('redis');

class RedisClient {
    constructor() {
        const redisUri = process.env.REDIS_URI || 'redis://localhost:6379'; // Use fallback URI if no REDIS_URI provided
        this.client = redis.createClient(redisUri);

        // Listen for connection errors
        this.client.on('error', (err) => {
            console.log(`Redis Client Error: ${err}`);

            // If connection fails, try to connect to the fallback (localhost)
            if (redisUri !== 'redis://localhost:6379') {
                console.log('Trying to connect to the local Redis server...');
                this.client = redis.createClient('redis://localhost:6379');
            }
        });

        // Optionally handle the connection 'ready' event
        this.client.on('ready', () => {
            console.log('Redis client connected successfully');
        });
    }
/*         this.client = redis.createClient({
            host : 'localhost',
            port: 6379
        });
        this.client.on('error', (err) => {
            console.log(`Redis Client Error: ${err}`);
        });
    }
 */
    isAlive() {
        return this.client.connected;
    }

    async get(key) {
        return new Promise((resolve, reject) => {
            this.client.get(key, (err, reply) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(reply)
                }
            });
        });
    }

    async set(key, value) {
        return new Promise((resolve, reject) => {
            this.client.set(key, value, (err, reply) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(reply)
                }
            });
        });
    }

    async expire(key, seconds) {
        return new Promise((resolve, reject) => {
            this.client.expire(key, seconds, (err, reply) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(reply);
                }
            });
        });
    }

    async del(key) {
        return new Promise((resolve, reject) => {
            this.client.del(key, (err, reply) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(reply)
                }
            });
        });
    }
}

const redisclient = new RedisClient();
module.exports = redisclient;