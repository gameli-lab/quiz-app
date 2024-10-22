const dbClient = require("../utils/db");

class User {
  static async getUserStats() {
    const db = dbClient.client.db();
    const activeCount = await db
      .collection("users")
      .countDocuments({ active: true });
    const inactiveCount = await db
      .collection("users")
      .countDocuments({ active: false });
    return { activeCount, inactiveCount };
  }
}

module.exports = User;
