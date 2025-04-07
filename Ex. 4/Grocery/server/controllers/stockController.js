const Stock = require('../models/Stock');

const getStockItems = async (req, res) => {
  const limit = parseInt(req.query.limit) || 0;
  try {
    const stockItems = await Stock.find({}).limit(limit).populate('suppliers.supplierId').lean();
    if (!stockItems.length) {
      return res.status(404).json({
        error: true,
        message: 'לא נמצאו פריטים במלאי',
        data: null,
      });
    }
    res.json({
      error: false,
      message: 'פריטים במלאי נמצאו',
      data: stockItems,
    });
  } catch (err) {
    console.error('Error fetching stock items:', err);
    return res.status(500).json({
      error: true,
      message: 'שגיאת שרת פנימית',
      data: null,
    });
  }
};

const getStockItem = async (req, res) => {
  const { _id } = req.params;
  try {
    const stockItem = await Stock.findById(_id).populate('suppliers.supplierId').lean();
    if (!stockItem) {
      return res.status(404).json({
        error: true,
        message: 'פריט מלאי לא נמצא',
        data: null,
      });
    }
    res.json({
      error: false,
      message: 'פריט מלאי נמצא',
      data: stockItem,
    });
  } catch (err) {
    console.error('Error fetching stock item:', err);
    return res.status(500).json({
      error: true,
      message: 'שגיאת שרת פנימית',
      data: null,
    });
  }
};

const addStockItem = async (req, res) => {
  const { name, uniqueId, minimumQuantity, unit, suppliers } = req.body;
  if (!name || !uniqueId || minimumQuantity === undefined || !unit) {
    return res.status(400).json({
      error: true,
      message: 'שם, מק"ט/ברקוד, כמות מינימלית ויחידה נדרשים',
      data: null,
    });
  }
  try {
    const existingStockItem = await Stock.findOne({ uniqueId }).lean();
    if (existingStockItem) {
      return res.status(409).json({
        error: true,
        message: 'פריט מלאי עם מק"ט/ברקוד זה כבר קיים',
        data: null,
      });
    }
    const newStockItem = await Stock.create({ name, uniqueId, minimumQuantity, unit, currentQuantity: 0, suppliers });
    res.status(201).json({
      error: false,
      message: 'פריט מלאי חדש נוצר',
      data: newStockItem,
    });
  } catch (error) {
    console.error('Error creating stock item:', error);
    res.status(400).json({
      error: true,
      message: error.message,
      data: null,
    });
  }
};


module.exports = {
  getStockItems,
  getStockItem,
  addStockItem
};