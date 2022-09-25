const supplierService = require('../service/supplier.service');

async function findAll(req, res) {
    supplierService.findAll().then(resp => {
        res.send(resp);
    }).catch(reject => {
        res.send(reject);
    });
}

async function findById(req, res) {
    supplierService.findById(req.params.id).then(resp => {
        res.send(resp);
    }).catch(reject => {
        res.send(reject);
    });
}

async function insert(req, res) {
    const supplierToStore = await supplierService.convertToStore(req.body);

    supplierService.insert(supplierToStore).then(resp => {
        res.send(resp);
    }).catch(reject => {
        res.send(reject);
    });
}

async function update(req, res) {
    supplierService.update(req.params.id, req.body).then(resp => {
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