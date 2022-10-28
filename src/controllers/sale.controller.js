const saleService = require('../service/sale.service');

async function findAll(req, res) {
    saleService.findAll().then(resp => {
        res.send(resp);
    }).catch(reject => {
        res.send(reject);
    });
}

async function findById(req, res) {
    await saleService.findById(req.params.id).then(resp => {
        res.send(resp);
    }).catch(reject => {
        res.send(reject);
    });
}

async function insert(req, res) {
    detailsSale = req.body.detailsSale
    const saleToStore = await saleService.convertToStore(req.body.sale);

    saleService.insert(saleToStore, detailsSale).then(resp => {
        res.send(resp);
    }).catch(reject => {
        res.send(reject);
    })
}

module.exports = {
    findAll,
    findById,
    insert
}