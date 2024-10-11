const dbClient = require('../utils/db');
const redisclient = require('../utils/redis');
const sha1 = require('sha1')

class UserController {
    static async postNew(req, res) {
        const { email, password } = req.body;

        if(!email) {
            return res.status(400).json({error: 'Missing email'});
        }
        if(!password) {
            return res.status(400).json({error: 'Missing password'});
        }
        try {
            const db = dbClient.client.db();
            const exUser = await db.collection('users').findOne({ email });
            if(exUser) {
                return res.status(400).json({error: 'email already exist'});
            }
            const hashedPass = sha1(password);
            const result = await db.collection('users').insertOne({ email, password: hashedPass });
            return res.status(201).json({ id: result.insertedId, email });
        } catch (error) {
            console.error('Error creating new user:', error);
            return res.status(500).json({ error: 'Internal Server Rrror'});
        }
    }
}

module.exports = UserController