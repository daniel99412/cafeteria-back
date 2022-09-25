const express = require('express');
const router = express.Router();
const SupplierController = require('../controllers/supplier.controller');

router.post('/', SupplierController.insert);
router.get('/', SupplierController.findAll);
router.get('/:id', SupplierController.findById);
router.put('/:id', SupplierController.update);

module.exports = router;