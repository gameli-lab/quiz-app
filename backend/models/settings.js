const dbClient = require('../utils/db');

class Settings {
    static async getSettings() {
        const db = dbClient.client.db();
        const settings = await db.collection('settings').findOne({});
        return settings;
    }

    static async updateSettings(newSettings) {
        const db = dbClient.client.db();
        await db.collection('settings').updateOne({}, { $set: newSettings }, { upsert: true });
    }
}

module.exports = Settings;
