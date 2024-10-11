const express = require('express');
const router = express.Router()
const AppController = require('../controllers/AppController');
//const UserController = require('../controllers/UsersController');

router.get('/status', AppController.getStatus);

module.exports = router;