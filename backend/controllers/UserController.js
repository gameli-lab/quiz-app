const dbClient = require('../utils/db');
const redisclient = require('../utils/redis');
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASS_LENGTH = 6;

class UserController {
    static async postNew(req, res) {
        const { email, password } = req.body;

        if(!email || !emailRegex.test(email)) {
            return res.status(400).json({error: 'Invalid email'});
        }
        if(!password || password.length < MIN_PASS_LENGTH) {
            return res.status(400).json({ error: `Password should be at least ${MIN_PASSWORD_LENGTH} characters long` });
        }
        try {
            const db = dbClient.client.db();
            const exUser = await db.collection('users').findOne({ email });
            if(exUser) {
                return res.status(400).json({error: 'Email already exist'});
            }
            const saltRounds = 10;
            const hashedPass = await bcrypt.hash(password, saltRounds);

            const result = await db.collection('users').insertOne({ email, password: hashedPass });
            return res.status(201).json({ id: result.insertedId, email });
        } catch (error) {
            console.error('Error creating new user:', error);
            return res.status(500).json({ error: 'Internal Server Rrror'});
        }
    }

    static async getMe(req, res) {
        const token = req.headers['x-token'];
        if(!token) {
            return res.status(401).json({ error: 'Unauthorised'});
        }
        const key = `auth_${token}`;
        const userId = await redisclient.get(key);
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorised'});
        }

        const db =  dbClient.client.db();
        const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
        if(!user) {
            return res.status(401).json({ error: 'Unauthorised' });
        }

        return res.status(200).json({ id: user._id, email: user.email });
    }


    static async updateProfile(req, res) {
        const token = req.headers['x-token'];
        const { email, password } = req.body;

        if (!token) {
            return res.status(401).json({ error: 'Unauthorised' });
        }
        const key = `auth_${token}`;
        const userId = await redisclient.get(key);
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorised'})
        }
        const db = dbClient.client.db();
        const updateData = {};
        if (email) updateData.email = email;
        if (password) updateData.password = await bcrypt.hash(password, 10);

        try {
            await db.collection('users').updateOne({ _id: new ObjectId(userId) }, {$set: updateData });
            return res.status(200).json({ message: 'Profile updated successfully'});
        } catch(error) {
            console.error('Error updating profile:', error);
            return res.status(500).json({ error: 'Internal server error'});
        }
    }
    static async deleteAccount(req, res) {
        const token = req.headers['x-token'];
        if (!token) {
            return res.status(401).json({ error: 'Unauthorised' });
        }

        const key = `auth_${token}`;
        const userId = await redisclient.get(key);
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorised' });
        }
        const db = dbClient.client.db();
        try {
            await db.collection('users').deleteOne({ _id: new ObjectId(userId) });
            await redisclient.del(key);
            return res.status(204).send();
        } catch(error) {
            console.error('Error deleting account:', error);
            return res.status(500).json({ error:'Internal server error' });
        }
    }

}


module.exports = UserController;