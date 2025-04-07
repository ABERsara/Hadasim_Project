const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');

router.post('/sales', salesController.processSales);

module.exports = router;