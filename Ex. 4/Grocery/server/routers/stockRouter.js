const express = require('express');
const stockController = require('../controllers/stockController');
const router = express.Router();

router.get('/', stockController.getStockItems);
router.get('/:_id', stockController.getStockItem);
router.post('/', stockController.addStockItem);


module.exports = router;