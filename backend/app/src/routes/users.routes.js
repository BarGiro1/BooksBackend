const express = require('express');
const router = express.Router();
const userController = require('../controllers/users.controller');
const validations = require('../validations/users.validations')
router
.get('/', userController.getAllUsers)
.get('/:userId', userController.getUserById)
.get('/email/:email', userController.getUserByEmail)
.post('/is-book-exist/:userId', validations.checkToken, userController.isBookExist)
.post('/user-details', validations.checkToken, userController.getUserDetails)
.put('/', validations.checkToken, validations.updatedUserAuth, userController.updateUser) 



module.exports = router;