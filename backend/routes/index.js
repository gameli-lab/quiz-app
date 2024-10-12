const express = require('express');
const router = express.Router();
const multer = require('multer')
const AppController = require('../controllers/AppController');
const AuthController = require('../controllers/AuthController');
const UserController = require('../controllers/UserController');
const QuizController = require('../controllers/QuizController')
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
router.delete('/users/me', checkRole('admin'), UserController.deleteAccount);

//Quiz management routes
router.get('quizzes/:subjectId', QuizController.getQuizBySubject);
router.post('/results', QuizController.saveResult);
router.post(
    'quizzes/upload',
    upload.single('file'),
    uploadValidator,
    validateUpload,
    checkRole('teacher'),
    QuizController.uploadQuizFile
);

module.exports = router;