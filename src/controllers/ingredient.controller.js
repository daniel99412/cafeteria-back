const ingredientService = require('../service/ingredient.service');

async function findAll(req, res) {
    ingredientService.findAll().then(resp => {
        res.send(resp);
    }).catch(reject => {
        res.send(reject);
    });
}

async function findById(req, res) {
    ingredientService.findById(req.params.id).then(resp => {
        res.send(resp);
    }).catch(reject => {
        res.send(reject);
    });
}

async function insert(req, res) {
    const ingredientToStore = await ingredientService.convertToStore(req.body);

    ingredientService.insert(ingredientToStore).then(resp => {
        res.send(resp);
    }).catch(reject => {
        res.send(reject);
    });
}

async function update(req, res) {
    ingredientService.update(req.params.id, req.body).then(resp => {
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