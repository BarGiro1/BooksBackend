const express = require('express');
const router = express.Router();
const passport = require('passport');
const userController = require('../controllers/users.controller');
const initializePassport = require('../config/userauth');
const validations = require('../validations/users.validations')
initializePassport(passport, email => {
    return userController.getUserByEmail(email);
}, id => {
    return userController.getUserById(id);
});

router
.post("/login",userController.userLogin)
.post("/register", validations.registerAuth, userController.createUser)
.post("/createAdmin", userController.createAdmin)

  module.exports = router;