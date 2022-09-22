const express = require('express');
const router = express.Router();
const IngredientController = require('../controllers/ingredient.controller');

router.post('/', IngredientController.insert);
router.get('/', IngredientController.findAll);
router.get('/:id', IngredientController.findById);
router.put('/:id', IngredientController.update);

module.exports = router;