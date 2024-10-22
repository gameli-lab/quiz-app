const dbClient = require("../utils/db");
const redisclient = require("../utils/redis");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

class AuthController {
  static async getConnect(req, res) {
    const authHeader = req.headers.authorization || "";

    // Check if the Authorization header exists and is properly formatted
    if (!authHeader.startsWith("Basic ")) {
      return res.status(401).json({ error: "Bad header" });
    }

    const base64Credentials = authHeader.split(" ")[1];
    const credentials = Buffer.from(base64Credentials, "base64").toString(
      "ascii"
    );
    const [username, password] = credentials.split(":");

    // Validate email and password
    if (!username || !password) {
      return res.status(401).json({ error: "invalid username or password" });
    }

    try {
      const db = dbClient.client.db();
      var user = await db.collection("users").findOne({ username });
      console.log("Fetched user:", user);
      //   var role = "admin";

      // Check if the user is an admin
      if (!user) {
        // If not found in adminData, search in users (userData)
        user = await db
          .collection("users")
          .findOne({ "userData.username": username });
        console.log("Fetched user:", user);
        // role = user ? user.userData.role : null; // Could be 'teacher' or 'student'
      }

      // Check if user exists
      if (!user) {
        return res.status(401).json({
          error: `User with username ${username} not found in database`
        });
      }

      // Compare provided password with the hashed password in the database
      //   const hashedPassword = user ? user.password : user.userData.password;
      const hashedPassword =
        user.password || (user.userData ? user.userData.password : null);
      const passwordMatch = await bcrypt.compare(password, hashedPassword);
      if (!passwordMatch) {
        return res.status(401).json({ error: "Invalid password" });
      }

      const role = user.role ? user.role : user.userData?.role;
      // Generate authentication token
      const token = uuidv4();
      const key = `auth_${token}`;

      // Store the token in Redis with the user ID and set expiration (24 hours)
      await redisclient.set(key, String(user._id));
      await redisclient.expire(key, 86400); // 86400 seconds = 24 hours

      // Return the token and user's role to the frontend
      return res.status(200).json({ token, role });
    } catch (error) {
      console.error("Error during authentication:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
  static async getDisconnect(req, res) {
    const token = req.headers["x-token"];
    if (!token) {
      return res.status(401).json({ error: "Unathorized" });
    }
    const key = `auth_${token}`;
    const userId = await redisclient.get(key);
    if (!userId) {
      return res.status(401).json({ error: "Unathorized" });
    }

    await redisclient.del(key);
    return res.status(204).send();
  }
}

module.exports = AuthController;

/* const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin"); // Your Admin schema
const User = require("../models/User"); // Your User schema

const secretKey = "your_jwt_secret_key";

const login = async (req, res) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return res.status(400).json({ error: "Missing Authorization header" });
  }

  const base64Credentials = authHeader.split(" ")[1];
  const credentials = Buffer.from(base64Credentials, "base64").toString(
    "ascii"
  );
  const [username, password] = credentials.split(":");

  try {
    var user;

    // If the username is 'admin', search the adminData collection
    if (username === "admin") {
      user = await Admin.findOne({ username });
    } else {
      // Otherwise, search in the userData collection for students and teachers
      user = await User.findOne({ "userData.username": username });
    }

    if (!user) {
      return res
        .status(404)
        .json({ error: `User with username ${username} not found` });
    }

    // Compare passwords (for both admin and user collections)
    const passwordField =
      username === "admin" ? user.password : user.userData.password;
    const isPasswordValid = await bcrypt.compare(password, passwordField);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Determine role and generate JWT
    const role = username === "admin" ? "admin" : user.userData.role;
    const token = jwt.sign({ username, role }, secretKey, { expiresIn: "1h" });

    return res.status(200).json({
      message: "Login successful",
      token,
      role
    });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong during login" });
  }
};

module.exports = { login };
 */
