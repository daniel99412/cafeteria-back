const productService = require('../service/product.service');

async function findAll(req, res) {
    productService.findAll().then(resp => {
        res.send(resp);
    }).catch(reject => {
        res.send(reject);
    });
}

async function findById(req, res) {
    await productService.findById(req.params.id).then(resp => {
        res.send(resp);
    }).catch(reject => {
        res.send(reject);
    });
}

async function insert(req, res) {
    const productToStore = await productService.convertToStore(req.body);

    productService.insert(productToStore).then(resp => {
        res.send(resp);
    }).catch(reject => {
        res.send(reject);
    });
}

async function update(req, res) {
    productService.update(req.params.id, req.body).then(resp => {
        res.send(resp);
    }).catch(reject => {
        res.send(reject);
    });
}

module.exports = {
    findAll,
    findById,
    insert,
    update
}