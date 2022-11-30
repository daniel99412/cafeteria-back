const productIngredientService = require('../service/productIngredient.service');

async function findByProduct(req, res) {
    await productIngredientService.findByProduct(req.params.id).then(resp => {
        res.send(resp);
    }).catch(reject => {
        res.send(reject);
    });
}

module.exports = {
    findByProduct
}