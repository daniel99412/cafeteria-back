const Ingredient = require('./igredient');
const Product = require('./product')

var ProductIngredient = {
    id: Number,
    product: Product,
    ingredient: Ingredient,
    amount: Number
};

module.exports = ProductIngredient;