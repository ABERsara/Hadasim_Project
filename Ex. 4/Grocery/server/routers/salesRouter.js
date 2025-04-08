const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');

router.post('/process', salesController.processSales);

module.exports = router;