const purchaseService = require('../service/purchase.service');

async function findAll(req, res) {
    purchaseService.findAll().then(resp => {
        res.send(resp);
    }).catch(reject => {
        res.send(reject);
    });
}

async function findById(req, res) {
    await purchaseService.findById(req.params.id).then(resp => {
        res.send(resp);
    }).catch(reject => {
        res.send(reject);
    });
}

async function insert(req, res) {
    const detailsPurchase = req.body.detailsPurchase;
    const purchaseToStore = await purchaseService.convertToStore(req.body.purchase);

    await purchaseService.insert(purchaseToStore, detailsPurchase).then(resp => {
        res.send(resp);
    }).catch(reject => {
        res.send(reject);
    });
}

module.exports = {
    findAll,
    findById,
    insert
}