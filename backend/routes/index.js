const express = require('express');
const router = express.Router();
const multer = require('multer')
const AppController = require('../controllers/AppController');
const AuthController = require('../controllers/AuthController');
const UserController = require('../controllers/UserController');
const QuizController = require('../controllers/QuizController')
const AnalyticsController = require('../controllers/AnalyticsController');
const SettingsController = require('../controllers/SettingsController');
const { userValidator, validateUser } = require('../validators/userValidator');
const { uploadValidator, validateUpload } = require('../validators/uploadValidator');
const { profileValidator, validateProfile } = require('../validators/profileValidator');
const { checkRole } = require('../middleware/rbac');

const upload = multer({ dest: 'uploads/' });


//Health check routes
router.get('/status', AppController.getStatus);
router.get('/stat', AppController.getStat);

//User management routes
router.post('/users', userValidator, validateUser, UserController.postNew);
router.get('/connect', AuthController.getConnect);
router.get('/disconnect', AuthController.getDisconnect);
router.get('/users/me', UserController.getMe);
router.put('/users/me', profileValidator, validateProfile, UserController.updateProfile);
router.delete('/users/:id', checkRole('admin'), UserController.deleteAccount);
router.get('/users', checkRole('admin'), UserController.getAllUsers);         // View all users
router.put('/users/:id/role', checkRole('admin'), UserController.updateUserRole);  // Update user role
router.put('/users/:id/status', checkRole('admin'), UserController.updateUserStatus); // Activate/deactivate user account
router.get('/users', checkRole('admin'), AnalyticsController.getUsersAnalytics);


//Quiz management routes
router.get('quizzes/:subjectId', QuizController.getQuizBySubject);
router.get('/quizzes', AnalyticsController.getQuizzesAnalytics);
router.post('/results', QuizController.saveResult);
router.post(
    'quizzes/upload',
    upload.single('file'),
    uploadValidator,
    validateUpload,
    QuizController.uploadQuizFile
);
router.put('/quizzes/:id/approve', checkRole('admin'), QuizController.approveQuiz);
router.put('/quizzes/:id/reject', checkRole('admin'), QuizController.rejectQuiz);
router.delete('/quizzes/:id', checkRole('admin'), QuizController.deleteQuiz);

// Routes for category management
router.post('/categories', checkRole('admin'), QuizController.createCategory);
router.put('/categories/:id', checkRole('admin'), QuizController.updateCategory);
router.delete('/categories/:id', checkRole('admin'), QuizController.deleteCategory);

// Category routes
router.post('/categories', QuizController.createCategory);
router.put('/categories/:id', QuizController.updateCategory);
router.delete('/categories/:id', QuizController.deleteCategory);


// Activity logs
router.get('/activityLogs', AnalyticsController.getActivityLogs);

// Reports routes
router.get('/reports', SettingsController.generateReport);
router.get('/reports', AnalyticsController.generateReport);

// Get current settings
router.get('/settings', SettingsController.getSettings);

// Update system settings
router.put('/settings', SettingsController.updateSettings);


module.exports = router;