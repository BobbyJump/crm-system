const express = require('express')
const controller = require('../controllers/auth')
const router = express.Router()

//localhost:port/api/auth/login
router.post('/login', controller.login)
//localhost:port/api/auth/register
router.post('/register', controller.register)

module.exports = router