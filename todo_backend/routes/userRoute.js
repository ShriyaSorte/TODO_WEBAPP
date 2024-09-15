const userController = require('../controllers/userController');
const express = require('express');
const router = express.Router();


router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);

module.exports = router;


// http://localhost:4001/api/users/register
// http://localhost:4001/api/users/login