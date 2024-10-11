const redis = require('redis');

class RedisClient {
    constructor() {
        this.client = redis.createClient({
            host : 'localhost',
            port: 6379
        });
        this.client.on('error', (err) => {
            console.log(`Redis Client Error: ${err}`);
        });
    }

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