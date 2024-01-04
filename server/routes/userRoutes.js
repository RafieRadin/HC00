const express = require('express');
const router = express.Router();

//controller functions
const { registerUser, loginUser } = require('../controllers/userController')

//login module
router.post('/login', loginUser)

//register module
router.post('/register', registerUser)

module.exports = router;