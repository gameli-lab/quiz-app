// progressController.js
const { ObjectId } = require("mongodb");
const dbClient = require("../utils/db"); // Database connection

class ProgressController {
  // Method to save progress
  static async saveProgress(req, res) {
    try {
      const { userId, quizId, questionsAnswered, score, completed } = req.body;

      // Ensure required fields are present
      if (!userId || !quizId || !questionsAnswered) {
        return res.status(400).json({ error: "Incomplete progress data" });
      }

      const db = dbClient.client.db();
      const progressData = {
        userId: new ObjectId(userId),
        quizId: new ObjectId(quizId),
        questionsAnswered,
        score: score || 0,
        completed: completed || false,
        timestamp: new Date()
      };

      // Insert or update progress
      await db.collection("progress").insertOne(progressData);
      return res.status(201).json({ message: "Progress saved successfully" });
    } catch (error) {
      console.error("Error saving progress:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Method to retrieve progress by user
  static async getProgressByUser(req, res) {
    try {
      const userId = req.params.userId;
      console.log("userId", userId);

      const db = dbClient.client.db();
      const progress = await db
        .collection("progress")
        .find({ userId: new ObjectId(userId) })
        .toArray();

      if (!progress) {
        return res
          .status(404)
          .json({ error: "No progress found for this user" });
      }

      return res.status(200).json(progress);
    } catch (error) {
      console.error("Error retrieving progress:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = ProgressController;
