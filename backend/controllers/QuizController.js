/* const Quiz = require("../models/quiz");
const redisclient = require("../utils/redis");
const fs = require("fs");
const path = require("path");
const mammoth = require("mammoth");
const pdfParse = require("pdf-parse");

class QuizController {
  static async uploadQuizFile(req, res) {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const filePath = path.join(__dirname, "..", "..", file.path);
    const extension = path.extname(file.origionalname).toLowerCase();

    try {
      var fileContent = "";
      if (extension === ".txt") {
        fileContent = fs.readFileSync(filePath, "utf-8");
      } else if (extension === ".docx") {
        const result = await mammoth.extractRawText({ path: filePath });
        fileContent = result.value;
      } else if (extension === "pdf") {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdfParse(dataBuffer);
        fileContent = data.text;
      } else {
        return res.status(400).json({ error: "Unsupported file type" });
      }

      const quizData = QuizController.processQuizData(fileContent);

      const subjectId = req.body.subjectId;
      const quizId = await Quiz.createQuiz(subjectId, quizData);
      return res.status(201).json({ quizId });
    } catch (error) {
      console.error("Error processing quiz file:", error);
      return res.status(500).json({ error: "Internal server error" });
    } finally {
      fs.unlinkSync(filePath);
    }
  }

  static async processQuizData(fileContent) {
    const questions = [];
    const lines = fileContent.split("\n");

    var currentQuestion = null;
    var choices = [];
    var correctAnswer = null;

    lines.forEach((line) => {
      line = line.trim();
      if (!line) return;

      if (line.startsWith("Q:")) {
        if (currentQuestion) {
          questions.push({
            questionText: currentQuestion,
            choices,
            correctAnswer
          });
        }
        currentQuestion = line.substring(2).trim();
        choices = [];
        correctAnswer = null;
      } else if (line.startsWith("A:")) {
        correctAnswer = line.substring(2).trim();
      } else {
        choices.push(line);
      }
    });

    if (currentQuestion) {
      questions.push({
        questionText: currentQuestion,
        choices,
        correctAnswer
      });
    }
    return questions;
  }

  static async getQuizBySubject(req, res) {
    const { subjectId } = req.params;
    try {
      const quiz = await Quiz.getQuizBySubject(subjectId);
      if (!quiz) {
        return res
          .status(404)
          .json({
            error: "Quiz not found for this subject. Please check again later"
          });
      }
      return res.status(200).json(quiz);
    } catch (error) {
      console.error(`Error fetching quiz: ${error}`);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async saveResult(req, res) {
    const { score, subjectId } = req.body;
    const token = req.headers["x-token"];
    try {
      const userId = await redisclient.get(`auth_${token}`);
      if (!userId) {
        return res.status(401).json({ error: "Unauthorised" });
      }
      const resultId = await Quiz.saveResult(userId, subjectId, score);
      return res.status(201).json({ resultId });
    } catch (error) {
      console.error("Error saving result:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  static async approveQuiz(req, res) {
    const { quizId } = req.params;
    try {
      const quiz = await Quiz.getQuizById(quizId);
      if (!quiz) {
        return res.status(404).json({ error: "Quiz not found" });
      }

      const result = await Quiz.updateQuizStatus(quizId, "approved");
      if (result.modifiedCount === 1) {
        return res.status(200).json({ message: "Quiz approved successfully" });
      } else {
        return res.status(400).json({ error: "Could not approve the quiz" });
      }
    } catch (error) {
      console.error("Error approving quiz:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  static async rejectQuiz(req, res) {
    const { id } = req.params;
    try {
      const db = dbClient.client.db();
      const result = await db
        .collection("quizzes")
        .updateOne({ _id: new ObjectId(id) }, { $set: { status: "rejected" } });
      if (result.modifiedCount === 0) {
        return res.status(404).json({ error: "Quiz not found" });
      }
      return res.status(200).json({ message: "Quiz rejected" });
    } catch (error) {
      console.error("Error rejecting quiz:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Method to fetch all quizzes (with optional filters)
  static async getAllQuizzes(req, res) {
    const { category, status } = req.query;
    const filters = {};
    if (category) filters.category = category;
    if (status) filters.status = status;

    try {
      const quizzes = await Quiz.getAllQuizzes(filters);
      return res.status(200).json(quizzes);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Method to delete a quiz
  static async deleteQuiz(req, res) {
    const { quizId } = req.params;
    try {
      const result = await Quiz.deleteQuiz(quizId);
      if (result.deletedCount === 1) {
        return res.status(204).send();
      } else {
        return res.status(404).json({ error: "Quiz not found" });
      }
    } catch (error) {
      console.error("Error deleting quiz:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Method to create a new category
  static async createCategory(req, res) {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Category name is required" });
    }

    try {
      const result = await Quiz.createCategory(name);
      return res.status(201).json({ categoryId: result.insertedId, name });
    } catch (error) {
      console.error("Error creating category:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Method to update a category
  static async updateCategory(req, res) {
    const { categoryId } = req.params;
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Category name is required" });
    }

    try {
      const result = await Quiz.updateCategory(categoryId, name);
      if (result.modifiedCount === 1) {
        return res
          .status(200)
          .json({ message: "Category updated successfully" });
      } else {
        return res.status(404).json({ error: "Category not found" });
      }
    } catch (error) {
      console.error("Error updating category:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Method to delete a category
  static async deleteCategory(req, res) {
    const { categoryId } = req.params;
    try {
      const result = await Quiz.deleteCategory(categoryId);
      if (result.deletedCount === 1) {
        return res.status(204).send();
      } else {
        return res.status(404).json({ error: "Category not found" });
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Method to get all categories
  static async getAllCategories(req, res) {
    try {
      const categories = await Quiz.getAllCategories();
      return res.status(200).json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

static async getResults(req, res) {
    try {
        const results = await Quiz.getResults(); 
        return res.json(results);
    } catch (error) {
        console.error('Error fetching results:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}


}

module.exports = QuizController;
 */

const { body, param, query, validationResult } = require("express-validator");
const Quiz = require("../models/quiz");
const redisclient = require("../utils/redis");
const fs = require("fs");
const path = require("path");
const mammoth = require("mammoth");
const pdfParse = require("pdf-parse");

class QuizController {
  // Middleware for input validation
  static validateUploadQuizFile() {
    return [
      body("subjectId").notEmpty().withMessage("Subject ID is required")
      // Add more validations as necessary
    ];
  }

  static validateSaveResult() {
    return [
      body("score").isNumeric().withMessage("Score must be a number"),
      body("subjectId").notEmpty().withMessage("Subject ID is required")
    ];
  }

  static validateQuizId() {
    return [param("quizId").isMongoId().withMessage("Invalid Quiz ID format")];
  }

  static validateCategory() {
    return [body("name").notEmpty().withMessage("Category name is required")];
  }

  static async uploadQuizFile(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = path.join(__dirname, "..", "..", file.path);
    const extension = path.extname(file.originalname).toLowerCase();

    let fileContent = "";
    try {
      if (extension === ".txt") {
        fileContent = fs.readFileSync(filePath, "utf-8");
      } else if (extension === ".docx") {
        const result = await mammoth.extractRawText({ path: filePath });
        fileContent = result.value;
      } else if (extension === ".pdf") {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdfParse(dataBuffer);
        fileContent = data.text;
      } else {
        return res.status(400).json({ error: "Unsupported file type" });
      }

      const quizData = QuizController.processQuizData(fileContent);
      const subjectId = req.body.subjectId;
      const quizId = await Quiz.createQuiz(subjectId, quizData);
      return res.status(201).json({ quizId });
    } catch (error) {
      console.error("Error processing quiz file:", error);
      return res.status(500).json({ error: "Internal server error" });
    } finally {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  }

  static async saveResult(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { score, subjectId } = req.body;
    const token = req.headers["x-token"];
    try {
      const userId = await redisclient.get(`auth_${token}`);
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const resultId = await Quiz.saveResult(userId, subjectId, score);
      return res.status(201).json({ resultId });
    } catch (error) {
      console.error("Error saving result:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  static async approveQuiz(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { quizId } = req.params;
    try {
      const quiz = await Quiz.getQuizById(quizId);
      if (!quiz) {
        return res.status(404).json({ error: "Quiz not found" });
      }

      const result = await Quiz.updateQuizStatus(quizId, "approved");
      if (result.modifiedCount === 1) {
        return res.status(200).json({ message: "Quiz approved successfully" });
      } else {
        return res.status(400).json({ error: "Could not approve the quiz" });
      }
    } catch (error) {
      console.error("Error approving quiz:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  static async rejectQuiz(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    try {
      const result = await Quiz.rejectQuiz(id);
      if (result.modifiedCount === 0) {
        return res.status(404).json({ error: "Quiz not found" });
      }
      return res.status(200).json({ message: "Quiz rejected" });
    } catch (error) {
      console.error("Error rejecting quiz:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Get a quiz by its subject ID
  static async getQuizBySubject(subjectId) {
    const db = dbClient.client.db();
    const quiz = await db
      .collection("quizzes")
      .findOne({ subject: new ObjectId(subjectId) });
    return quiz;
  }

  static async getAllQuizzes(req, res) {
    const { category, status } = req.query;
    const filters = {};
    if (category) filters.category = category;
    if (status) filters.status = status;

    try {
      const quizzes = await Quiz.getAllQuizzes(filters);
      return res.status(200).json(quizzes);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  static async deleteQuiz(req, res) {
    const { quizId } = req.params;
    try {
      const result = await Quiz.deleteQuiz(quizId);
      if (result.deletedCount === 1) {
        return res.status(204).send();
      } else {
        return res.status(404).json({ error: "Quiz not found" });
      }
    } catch (error) {
      console.error("Error deleting quiz:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  static async createCategory(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name } = req.body;
    try {
      const result = await Quiz.createCategory(name);
      return res.status(201).json({ categoryId: result.insertedId, name });
    } catch (error) {
      console.error("Error creating category:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  static async updateCategory(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { categoryId } = req.params;
    const { name } = req.body;
    try {
      const result = await Quiz.updateCategory(categoryId, name);
      if (result.modifiedCount === 1) {
        return res
          .status(200)
          .json({ message: "Category updated successfully" });
      } else {
        return res.status(404).json({ error: "Category not found" });
      }
    } catch (error) {
      console.error("Error updating category:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  static async deleteCategory(req, res) {
    const { categoryId } = req.params;
    try {
      const result = await Quiz.deleteCategory(categoryId);
      if (result.deletedCount === 1) {
        return res.status(204).send();
      } else {
        return res.status(404).json({ error: "Category not found" });
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  static async getAllCategories(req, res) {
    try {
      const categories = await Quiz.getAllCategories();
      return res.status(200).json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  static async getResults(req, res) {
    try {
      const results = await Quiz.getResults();
      return res.json(results);
    } catch (error) {
      console.error("Error fetching results:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = QuizController;
