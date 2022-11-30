const express = require('express');
const router = express.Router();
const PurchaseController = require('../controllers/purchase.constroller');

router.post('/', PurchaseController.insert);
router.get('/', PurchaseController.findAll);
router.get('/:id', PurchaseController.findById);

module.exports = router;