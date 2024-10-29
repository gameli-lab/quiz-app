const { ObjectId } = require("mongodb");
const dbClient = require("../utils/db");

class Quiz {
  // Create a new quiz
  static async createQuiz(subjectId, questions) {
    const db = dbClient.client.db();
    const quizData = {
      subject: new ObjectId(subjectId),
      questions,
      status: "pending",
      createdAt: new Date()
    };
    const result = await db.collection("quizzes").insertOne(quizData);
    return result.insertedId;
  }

  // Save a user's result for a quiz
  static async saveResult(userId, subjectId, score) {
    const db = dbClient.client.db();
    const resultData = {
      userId: new ObjectId(userId),
      subject: new ObjectId(subjectId),
      score,
      completedAt: new Date()
    };
    const result = await db.collection("results").insertOne(resultData);
    return result.insertedId;
  }

  // Update the status of a quiz
  static async updateQuizStatus(quizId, status) {
    const db = dbClient.client.db();
    return await db
      .collection("quizzes")
      .updateOne({ _id: new ObjectId(quizId) }, { $set: { status } });
  }

  // Fetch all quizzes with optional filters
  static async getAllQuizzes(filters = {}) {
    const db = dbClient.client.db();
    return await db.collection("quizzes").find(filters).toArray();
  }

  static async getAllCategories() {
    const db = dbClient.client.db();
    return await db.collection("categories").find().toArray();
  }

  // Delete a quiz by its ID
  static async deleteQuiz(quizId) {
    const db = dbClient.client.db();
    return await db
      .collection("quizzes")
      .deleteOne({ _id: new ObjectId(quizId) });
  }

  // Create a new quiz category
  static async createCategory(name) {
    const db = dbClient.client.db();
    const categoryData = {
      name,
      createdAt: new Date()
    };
    return await db.collection("categories").insertOne(categoryData);
  }

  // Update a quiz category by its ID
  static async updateCategory(categoryId, name) {
    const db = dbClient.client.db();
    return await db
      .collection("categories")
      .updateOne({ _id: new ObjectId(categoryId) }, { $set: { name } });
  }

  // Delete a quiz category by its ID
  static async deleteCategory(categoryId) {
    const db = dbClient.client.db();
    return await db
      .collection("categories")
      .deleteOne({ _id: new ObjectId(categoryId) });
  }

  // Fetch results for a specific user
  static async getResults(userId) {
    const db = dbClient.client.db();
    return await db
      .collection("results")
      .find({ userId: new ObjectId(userId) })
      .toArray();
  }

  /*   // Get a quiz by its ID
  static async getQuizById(quizId) {
    const db = dbClient.client.db();
    return await db
      .collection("quizzes")
      .findOne({ _id: new ObjectId(quizId) });
  }
 */
  // Reject a quiz by its ID
  static async rejectQuiz(quizId) {
    const db = dbClient.client.db();
    return await db
      .collection("quizzes")
      .updateOne(
        { _id: new ObjectId(quizId) },
        { $set: { status: "rejected" } }
      );
  }

  // Get quiz statistics
  static async getQuizStats() {
    const db = dbClient.client.db();
    const quizzes = await db
      .collection("quizzes")
      .aggregate([
        {
          $lookup: {
            from: "results",
            localField: "_id",
            foreignField: "quizId",
            as: "results"
          }
        },
        {
          $project: {
            subjectName: 1,
            takenCount: { $size: "$results" },
            averageScore: { $avg: "$results.score" }
          }
        }
      ])
      .toArray();
    return quizzes;
  }

  // Fetch a category by its name
  static async getCategoryByName(name) {
    const db = dbClient.client.db();
    return await db.collection("categories").findOne({ name });
  }
}

module.exports = Quiz;
