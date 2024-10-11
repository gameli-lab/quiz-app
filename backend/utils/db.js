const { MongoClient } = require('mongodb');

class DBClient {
    constructor() {
        const host = process.env.DB_HOST || 'localhost';
        const port = process.env.DB_PORT || 27017;
        const database = process.env.DB_DATABASE || 'backend';

        this.uri = `mongodb://${host}:${port}/${database}`;
        this.client = new MongoClient(this.uri, {useNewUrlParser: true, useUnifiedTopology: true});

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
        const db = this.client.db();
        const allUsers = await db.collection('users').countDocuments();
        return allUsers;
    }

    async numFiles() {
        if(!this.isAlive()) {
            throw new Error('Client not connected')
        }
        const db = this.client.db();
        const files = await db.collection('files').countDocuments();
        return files;
    }

}

const dbClient = new DBClient();
module.exports = dbClient;