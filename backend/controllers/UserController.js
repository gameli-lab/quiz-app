const dbClient = require("../utils/db");
const redisclient = require("../utils/redis");
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASS_LENGTH = 6;

class UserController {
  static async postNew(req, res) {
    const {
      email,
      password,
      username,
      role,
      fullName,
      gradeLevel,
      schoolName,
      subjectExpertise,
      phoneNumber,
      yearsOfExperience,
      dateOfBirth,
      guardianContact
    } = req.body;

    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email" });
    }
    if (!password || password.length < MIN_PASS_LENGTH) {
      return res.status(400).json({
        error: `Password should be at least ${MIN_PASSWORD_LENGTH} characters long`
      });
    }
    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }
    if (!role || (role !== "student" && role !== "teacher")) {
      return res
        .status(400)
        .json({ error: 'Role must be either "studend" or "teacher"' });
    }
    if (role === "teacher") {
      if (!fullName || !subjectExpertise || !schoolName) {
        return res.status(400).json({
          error: "Full name, subject expertise, and school are required"
        });
      }
    } else if (role === "student") {
      if (!fullName || !gradeLevel || !schoolName) {
        return res.status(400).json({
          error: "Full name, grade level(class), and school are required"
        });
      }
    }
    try {
      const db = dbClient.client.db();
      const exUser = await db.collection("users").findOne({ email });
      if (exUser) {
        return res.status(400).json({ error: "Email already exist" });
      }
      const saltRounds = 10;
      const hashedPass = await bcrypt.hash(password, saltRounds);

      const userData = {
        email,
        password: hashedPass,
        username,
        fullName,
        role,
        schoolName
      };
      if (role === "student") {
        userData.gradeLevel = gradeLevel;
        userData.dateOfBirth = dateOfBirth;
        userData.guardianContact = guardianContact;
      } else if (role === "teacher") {
        userData.subjectExpertise = subjectExpertise;
        userData.phoneNumber = phoneNumber;
        userData.yearsOfExperience = yearsOfExperience;
      }

      const result = await db.collection("users").insertOne({ userData });
      return res.status(201).json({ id: result.insertedId, email, role });
    } catch (error) {
      console.error("Error creating new user:", error);
      return res.status(500).json({ error: "Internal Server Rrror" });
    }
  }

  static async getMe(req, res) {
    const token = req.headers["x-token"];
    if (!token) {
      console.error("Unauthorized request - missing token");
      return res.status(401).json({ error: "Unauthorized - missing token" });
    }

    const key = `auth_${token}`;
    let userId;

    try {
      userId = await redisclient.get(key);
    } catch (error) {
      console.error("Redis error retrieving user ID:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (!userId) {
      console.error("Unauthorized request - invalid or expired token");
      return res.status(401).json({ error: "Unauthorized - invalid token" });
    }

    try {
      const db = dbClient.client.db();
      const user = await db
        .collection("users")
        .findOne({ _id: new ObjectId(userId) });

      if (!user) {
        console.error("Unauthorized request - user not found in database");
        return res.status(401).json({ error: "Unauthorized - user not found" });
      }

      return res.status(200).json({
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        fullName: user.fullName,
        schoolName: user.schoolName,
        ...(user.role === "teacher" && {
          subjectExpertise: user.subjectExpertise
        }),
        ...(user.role === "student" && {
          gradeLevel: user.gradeLevel,
          dateOfBirth: user.dateOfBirth
        })
      });
    } catch (error) {
      console.error("Database error retrieving user:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async updateProfile(req, res) {
    const token = req.headers["x-token"];
    const {
      email,
      password,
      username,
      fullName,
      gradeLevel,
      schoolName,
      phoneNumber,
      subjectExpertise,
      yearsOfExperience,
      guardianContact
    } = req.body;

    if (!token) {
      return res.status(401).json({ error: "Unauthorised - missing token" });
    }
    const key = `auth_${token}`;
    const userId = await redisclient.get(key);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorised - invalid token" });
    }
    const db = dbClient.client.db();
    const updateData = {};
    if (email) updateData.email = email;
    if (password) updateData.password = await bcrypt.hash(password, 10);
    if (username) updateData.username = username;
    if (fullName) updateData.fullName = fullName;
    if (gradeLevel) updateData.gradeLevel = gradeLevel;
    if (schoolName) updateData.schoolName = schoolName;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (subjectExpertise) updateData.subjectExpertise = subjectExpertise;
    if (yearsOfExperience) updateData.yearsOfExperience = yearsOfExperience;
    if (guardianContact) updateData.guardianContact = guardianContact;

    try {
      await db
        .collection("users")
        .updateOne({ _id: new ObjectId(userId) }, { $set: updateData });
      return res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
      console.error("Error updating profile:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

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

  static async getAllUsers(req, res) {
    const db = dbClient.client.db();
    const { role, status } = req.query;

    const query = {};
    if (role) query.role = role;
    if (status) query.status = status;

    try {
      const users = await db.collection("users").find(query).toArray();
      return res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async updateUserRole(req, res) {
    const { id } = req.params;
    const { role } = req.body;

    if (!["student", "teacher", "admin"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    try {
      const db = dbClient.client.db();
      const user = await db
        .collection("users")
        .findOneAndUpdate(
          { _id: new ObjectId(id) },
          { $set: { role } },
          { returnDocument: "after" }
        );
      if (!user.value) return res.status(404).json({ error: "User not found" });

      return res
        .status(200)
        .json({ message: "Role updated successfully", user: user.value });
    } catch (error) {
      console.error("Error updating user role:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async updateUserStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;

    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    try {
      const db = dbClient.client.db();
      const user = await db
        .collection("users")
        .findOneAndUpdate(
          { _id: new ObjectId(id) },
          { $set: { status } },
          { returnDocument: "after" }
        );
      if (!user.value) return res.status(404).json({ error: "User not found" });

      return res.status(200).json({
        message: "User status updated successfully",
        user: user.value
      });
    } catch (error) {
      console.error("Error updating user status:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async deleteAccount(req, res) {
    const token = req.headers["x-token"];
    if (!token) {
      return res.status(401).json({ error: "Unauthorised - missing token" });
    }

    const key = `auth_${token}`;
    const userId = await redisclient.get(key);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorised - invalid token" });
    }
    const db = dbClient.client.db();
    try {
      result = await db
        .collection("users")
        .deleteOne({ _id: new ObjectId(userId) });
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      await redisclient.del(key);
      return res.status(204).send();
    } catch (error) {
      console.error("Error deleting account:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Get User by ID
  static async getUserById(req, res) {
    const { id } = req.params;

    try {
      const db = dbClient.client.db();
      const user = await db
        .collection("users")
        .findOne({ _id: new ObjectId(id) });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // Search Users
  static async searchUsers(req, res) {
    const { query } = req.query; // Assuming a query parameter for searching

    try {
      const db = dbClient.client.db();
      const users = await db
        .collection("users")
        .find({
          $or: [
            { username: { $regex: query, $options: "i" } },
            { email: { $regex: query, $options: "i" } },
            { fullName: { $regex: query, $options: "i" } }
          ]
        })
        .toArray();

      return res.status(200).json(users);
    } catch (error) {
      console.error("Error searching users:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // Reset Password
  static async resetPassword(req, res) {
    const { email, newPassword } = req.body;

    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email" });
    }
    if (!newPassword || newPassword.length < MIN_PASS_LENGTH) {
      return res
        .status(400)
        .json({
          error: `Password should be at least ${MIN_PASS_LENGTH} characters long`
        });
    }

    try {
      const db = dbClient.client.db();
      const user = await db.collection("users").findOne({ email });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const saltRounds = 10;
      const hashedPass = await bcrypt.hash(newPassword, saltRounds);

      await db
        .collection("users")
        .updateOne({ _id: user._id }, { $set: { password: hashedPass } });

      return res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
      console.error("Error resetting password:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // Activate/Deactivate User
  static async activateDeactivateUser(req, res) {
    const { id } = req.params;
    const { status } = req.body; // expected to be 'active' or 'inactive'

    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    try {
      const db = dbClient.client.db();
      const user = await db
        .collection("users")
        .findOneAndUpdate(
          { _id: new ObjectId(id) },
          { $set: { active: status === "active" } },
          { returnDocument: "after" }
        );

      if (!user.value) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json({
        message: `User status updated to ${status}`,
        user: user.value
      });
    } catch (error) {
      console.error("Error activating/deactivating user:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = UserController;
