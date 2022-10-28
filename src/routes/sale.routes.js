const express = require('express');
const router = express.Router();
const SaleController = require('../controllers/sale.controller');

router.post('/', SaleController.insert);
router.get('/', SaleController.findAll);
router.get('/:id', SaleController.findById);

module.exports = router;