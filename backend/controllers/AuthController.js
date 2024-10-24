const dbClient = require("../utils/db");
const redisclient = require("../utils/redis");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

class AuthController {
  static async getConnect(req, res) {
    const authHeader = req.headers.authorization || "";

    if (!authHeader.startsWith("Basic ")) {
      return res.status(401).json({ error: "Bad header" });
    }

    const base64Credentials = authHeader.split(" ")[1];
    const credentials = Buffer.from(base64Credentials, "base64").toString(
      "ascii"
    );
    const [username, password] = credentials.split(":");

    if (!username || !password) {
      return res.status(401).json({ error: "invalid username or password" });
    }

    try {
      const db = dbClient.client.db();
      var user = await db.collection("users").findOne({ username });
      console.log("Fetched user:", user);

      if (!user) {
        user = await db
          .collection("users")
          .findOne({ "userData.username": username });
        console.log("Fetched user:", user);
      }

      if (!user) {
        return res.status(401).json({
          error: `User with username ${username} not found in database`
        });
      }

      const hashedPassword =
        user.password || (user.userData ? user.userData.password : null);
      const passwordMatch = await bcrypt.compare(password, hashedPassword);
      if (!passwordMatch) {
        return res.status(401).json({ error: "Invalid password" });
      }

      const role = user.role ? user.role : user.userData?.role;
      const token = uuidv4();
      const key = `auth_${token}`;

      await redisclient.set(key, String(user._id));
      await redisclient.expire(key, 86400);

      return res.status(200).json({ token, role });
    } catch (error) {
      console.error("Error during authentication:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async getDisconnect(req, res) {
    const token = req.headers["x-token"];
    if (!token) {
      return res.status(401).json({ error: "Unathorized - missing token" });
    }
    const key = `auth_${token}`;
    const userId = await redisclient.get(key);
    if (!userId) {
      return res.status(401).json({ error: "Unathorized - invalid token" });
    }

    await redisclient.del(key);
    return res.status(204).send();
  }
}

module.exports = AuthController;
