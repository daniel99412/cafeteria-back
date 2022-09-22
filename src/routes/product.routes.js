const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/product.controller');

router.post('/', ProductController.insert);
router.get('/', ProductController.findAll);
router.get('/:id', ProductController.findById);
router.put('/:id', ProductController.update);
// DELETE

module.exports = router;