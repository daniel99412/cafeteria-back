const express = require('express');
const router = express.Router();
const IvaController = require('../controllers/iva.controller');

router.post('/', IvaController.insert);
router.get('/', IvaController.findAll);
router.get('/:id', IvaController.findById);
router.put('/:id', IvaController.update);

module.exports = router;