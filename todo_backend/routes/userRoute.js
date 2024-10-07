const userController = require('../controllers/userController');
const express = require('express');
const router = express.Router();
const {auth} = require('../middlewares/authorize');


router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get('/getUserInfo', auth, userController.getUserInfo);
router.get('/getAllUsers', auth, userController.getAllUsers);

module.exports = router;

// http://localhost:4001/api/users/register
// http://localhost:4001/api/users/login
// http://localhost:4001/api/users/getUserInfo