const dbClient = require('../utils/db');
const redisclient = require('../utils/redis');
const { ObjectId } = require('mongodb');

const chechRole = (requiredRole) => {
    return async (req, res, next) => {
        const token = req.headers['x-token'];
        if (!token) {
            return res.status(401).json({ error: 'Unauthorised'});
        }

        const key = `auth_${token}`;
        const userId = await redisclient.get(key);
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorised' });
        }
        const db = dbClient.client.db();
        const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
        if (!user) {
            return res.status(401).json({ error: 'Unauthorised' });
        }
        if (user.role !== 'root' && user.role !== requiredRole) {
            return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
        }
        req.user = user;
        next();
    };
};


module.exports = { chechRole }