const express = require('express');
const router = express.Router();
const ProductIngredientController = require('../controllers/productIngredient.controller');

router.get('/:id', ProductIngredientController.findByProduct);

module.exports = router;