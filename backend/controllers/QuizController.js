const { body, param, query, validationResult } = require("express-validator");
const Quiz = require("../models/quiz");
const dbClient = require("../utils/db");
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

  static processQuizData(fileContent) {
    const quizData = [];
    const questionBlocks = fileContent.split(/\n\s*\n/); // Splits by double line breaks for each question block

    questionBlocks.forEach((block) => {
      const lines = block.trim().split("\n");
      const questionText = lines[0];

      const choices = lines
        .slice(1, -1)
        .map((line) => line.replace(/^[A-D]:\s*/, "").trim()); // Remove letter labels
      const answer = lines[lines.length - 1].replace(/Answer:\s*/, "").trim();

      if (questionText && choices.length && answer) {
        quizData.push({
          question: questionText,
          choices,
          answer
        });
      }
    });

    return quizData;
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

    const filePath = file.path; // Use the multer-provided file path
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

      // Extract the category from the content
      const categoryMatch = fileContent.match(/Category:\s*(.+)/i);
      if (!categoryMatch) {
        return res
          .status(400)
          .json({ error: "Category not specified in the file" });
      }
      const categoryName = categoryMatch[1].trim();

      // Check if category exists or create a new one
      let subjectId;
      const category = await Quiz.getCategoryByName(categoryName);
      if (category) {
        subjectId = category._id; // Use existing subjectId
      } else {
        const newCategory = await Quiz.createCategory(categoryName);
        subjectId = newCategory.insertedId; // Use new subjectId
      }

      // Process quiz data and create the quiz
      const quizData = QuizController.processQuizData(fileContent);
      const quizId = await Quiz.createQuiz(subjectId, quizData); // quizId is auto-generated by MongoDB

      // Return the generated quizId
      return res.status(201).json({ quizId });
    } catch (error) {
      console.error("Error processing quiz file:", error);
      return res.status(500).json({ error: "Internal server error" });
    } finally {
      // Cleanup uploaded file
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
  static async getQuizBySubject(req, res) {
    try {
      const subjectId = req.params.subjectId;
      const db = dbClient.client.db();
      const quiz = await db
        .collection("quizzes")
        .findOne({ subject: new ObjectId(subjectId) });

      if (!quiz) {
        return res.status(404).json({ error: "Quiz not found" });
      }

      res.status(200).json(quiz);
    } catch (error) {
      console.error("Error retrieving quiz by subject:", error);
      res.status(500).json({ error: "Internal server error" });
    }
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
