const express = require('express');
const router = express.Router();
const helathController = require('../controllers/health.controller');

router
.get('/', helathController.health_check);

module.exports = router;