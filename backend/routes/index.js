const express = require("express");
const router = express.Router();
const multer = require("multer");
const AppController = require("../controllers/AppController");
const AuthController = require("../controllers/AuthController");
const UserController = require("../controllers/UserController");
const QuizController = require("../controllers/QuizController");
const ProgressController = require("../controllers/ProgressController");
const verifyToken = require("../middleware/Token");
const Quiz = require("../models/quiz");
const AnalyticsController = require("../controllers/AnalyticsController");
const SettingsController = require("../controllers/SettingsController");
const { userValidator, validateUser } = require("../validators/userValidator");
const {
  uploadValidator,
  validateUpload
} = require("../validators/uploadValidator");
const {
  profileValidator,
  validateProfile
} = require("../validators/profileValidator");
const { checkRole } = require("../middleware/rbac");

const upload = multer({ dest: "uploads/" });

// Health check routes
router.get("/status", AppController.getStatus);
router.get("/stat", AppController.getStat);

// Authentication routes
router.post("/connect", AuthController.getConnect);
router.post("/disconnect", verifyToken, AuthController.getDisconnect);

// User management routes
router.post("/users", userValidator, validateUser, UserController.postNew);
router.get("/users/me", verifyToken, UserController.getMe); // Protected route
router.put(
  "/users/me",
  verifyToken,
  profileValidator,
  validateProfile,
  UserController.updateProfile // Protected route
);
router.delete(
  "/users/:id",
  verifyToken,
  checkRole("admin"),
  UserController.deleteAccount // Protected route
);
router.get(
  "/users",
  verifyToken,
  checkRole("admin"),
  UserController.getAllUsers // Protected route
);
router.get(
  "/users/:id",
  verifyToken,
  checkRole("admin"),
  UserController.getUserById // Protected route
);
router.put(
  "/users/:id/role",
  verifyToken,
  checkRole("admin"),
  UserController.updateUserRole // Protected route
);
router.put(
  "/users/:id/status",
  verifyToken,
  checkRole("admin"),
  UserController.updateUserStatus // Protected route
);
router.put(
  "/users/:id/reset-password",
  verifyToken,
  checkRole("admin"),
  UserController.resetPassword // Protected route
);
router.get(
  "/users/analytics",
  verifyToken,
  checkRole("admin"),
  AnalyticsController.getUsersAnalytics // Protected route
);
router.get("/users/analytics", verifyToken, UserController.getUserStats); // Get User Stats

// Progress tracking routes
router.post("/progress", ProgressController.saveProgress);
router.get("/progress/:userId", ProgressController.getProgressByUser);

// Quiz management routes
router.post(
  "/quizzes",
  verifyToken,
  checkRole("admin"),
  Quiz.createQuiz // Create Quiz
);
router.get("/quizzes/:subjectId", verifyToken, QuizController.getQuizBySubject); // Protected route
router.get("/quizzes/:quizId", verifyToken, QuizController.getQuizById); // Protected route
router.get("/quizzes", verifyToken, QuizController.getAllQuizzes); // Get All Quizzes
router.delete(
  "/quizzes/:id",
  verifyToken,
  checkRole("admin"),
  QuizController.deleteQuiz // Protected route
);
router.put(
  "/quizzes/:id/approve",
  verifyToken,
  checkRole("admin"),
  QuizController.approveQuiz // Protected route
);
router.put(
  "/quizzes/:id/reject",
  verifyToken,
  checkRole("admin"),
  QuizController.rejectQuiz // Protected route
);
router.get(
  "/quizzes/stats",
  verifyToken,
  checkRole("admin"),
  Quiz.getQuizStats // Get Quiz Stats
);

// Quiz result management
router.post("/results", verifyToken, QuizController.saveResult); // Protected route
router.get("/results", verifyToken, QuizController.getResults); // Get quiz results

// Quiz file upload
router.post(
  "/quizzes/upload",
  verifyToken,
  upload.single("file"),
  uploadValidator,
  validateUpload,
  QuizController.uploadQuizFile // Protected route
);
router.post(
  "/upload-quiz",
  verifyToken,
  QuizController.validateUploadQuizFile(),
  QuizController.uploadQuizFile // Protected route
);
router.post(
  "/save-result",
  verifyToken,
  QuizController.validateSaveResult(),
  QuizController.saveResult // Protected route
);

// Category management routes
router.post(
  "/categories",
  verifyToken,
  checkRole("admin"),
  QuizController.createCategory // Protected route
);
router.put(
  "/categories/:id",
  verifyToken,
  checkRole("admin"),
  QuizController.updateCategory // Protected route
);
router.delete(
  "/categories/:id",
  verifyToken,
  checkRole("admin"),
  QuizController.deleteCategory // Protected route
);
router.get("/categories", verifyToken, QuizController.getAllCategories); // Protected route

// Analytics and activity log routes
router.get(
  "/activityLogs",
  verifyToken,
  AnalyticsController.getActivityLogs // Protected route
);
router.get("/reports", verifyToken, AnalyticsController.generateReport); // Protected route

// Settings routes
router.get("/settings", verifyToken, SettingsController.getSettings); // Protected route
router.put("/settings", verifyToken, SettingsController.updateSettings); // Protected route

module.exports = router;
