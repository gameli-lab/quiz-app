const { MongoClient } = require('mongodb');
require('dotenv').config();

class DBClient {
    constructor() {
        const host = process.env.DB_HOST || 'localhost';
        const port = process.env.DB_PORT || 27017;
        const database = process.env.DB_DATABASE || 'quiz-app';

        this.uri = `mongodb://${host}:${port}/${database}`;
        this.client = new MongoClient(this.uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            retryWrites: true
        });

        this.connected = false;
        this.client.connect()
        .then(() => {
            console.log('Connected to MongoDB');
            this.connected = true;
        })
        .catch(error => {
            console.log('Mongo connection failled', error);
        });
    }

    isAlive() {
        return this.connected;
    }

    async numUsers() {
        if(!this.isAlive()) {
            throw new Error('Client not connect');
        }
        try {
            const db = this.client.db();
            const allUsers = await db.collection('users').countDocuments();
            return allUsers;
        } catch(error) {
            console.error('Error counting users:', error);
        }
    }

    async numQuizzes() {
        if(!this.isAlive()) {
            throw new Error('Client not connected')
        }
        try {
            const db = this.client.db();
            const quizzes = await db.collection('quizzes').countDocuments();
            return quizzes;
        } catch(error) {
            console.error('Error counting quizzes:', error);
        }
    }

}

const dbClient = new DBClient();
module.exports = dbClient;