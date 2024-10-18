const dbClient = require('../utils/db');
const redisclient = require('../utils/redis');
const { v4: uuidv4 } = require ('uuid');
const bcrypt = require('bcrypt');


class AuthController {
/*     static async getConnect(req, res) {
        const authHeader = req.headers.authorization || '';
        const base64Credentials = authHeader.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [email, password] = credentials.split(':');

        if(!email || !password) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        try {
            const db = dbClient.client.db();
            const user = await db.collection('users').findOne({ email });

            if(!user) {
                return res.status(401).json({ error: 'User not found'});
            }

            const passMatch = await bcrypt.compare(password, user.password);
            if (!passMatch) {
                return res.status(401).json({ error: 'Wrong password' });
            }

            const token = uuidv4();
            const key = `auth_${token}`;
            await redisclient.set(key, String(user._id));
            redisclient.client.expire(key, 86400);

            return res.status(200).json({ token });
        } catch(error) {
            console.error('Error during authentication:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
 */

    static async getConnect(req, res) {
        const authHeader = req.headers.authorization || '';
        
        // Check if the Authorization header exists and is properly formatted
        if (!authHeader.startsWith('Basic ')) {
            return res.status(401).json({ error: 'Bad header' });
        }

        const base64Credentials = authHeader.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [email, password] = credentials.split(':');

        // Validate email and password
        if (!email || !password) {
            return res.status(401).json({ error: 'invalid email or password' });
        }

        try {
            const db = dbClient.client.db();
            const user = await db.collection('users').findOne({ email });
            console.log(user);

            // Check if user exists
            if (!user) {
                return res.status(401).json({ error: 'User not found' });
            }

            // Compare provided password with the hashed password in the database
            const passMatch = await bcrypt.compare(password, user.password);
            if (!passMatch) {
                return res.status(401).json({ error: 'Wrong password' });
            }

            // Generate authentication token
            const token = uuidv4();
            const key = `auth_${token}`;
            
            // Store the token in Redis with the user ID and set expiration (24 hours)
            await redisClient.set(key, String(user._id));
            await redisClient.expire(key, 86400);  // 86400 seconds = 24 hours

            // Return the token and user's role to the frontend
            return res.status(200).json({ token, role: user.role });
        } catch (error) {
            console.error('Error during authentication:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    static async getDisconnect(req, res) {
        const token = req.headers['x-token'];
        if(!token) {
            return res.status(401).json({ error: 'Unathorized' });
        }
        const key = `auth_${token}`;
        const userId = await redisclient.get(key);
        if(!userId) {
            return res.status(401).json({ error: 'Unathorized' });
        }

        await redisclient.del(key);
        return res.status(204).send();
    }
}

module.exports = AuthController;