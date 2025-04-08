const express = require("express");
const suppliersController = require("../controllers/suppliersController");
const router = express.Router();

router.get("/", suppliersController.getSuppliers);
router.get("/:_id", suppliersController.getSupplier);
router.post("/", suppliersController.addSupplier);
router.get('/:supplierId/products', suppliersController.getSupplierProducts);

module.exports = router;