const employeeService = require('../service/employee.service');

async function findAll(req, res) {
    employeeService.findAll().then(resp => {
        res.send(resp);
    }).catch(reject => {
        res.send(reject);
    });
}

async function findById(req, res) {
    employeeService.findById(req.params.id).then(resp => {
        res.send(resp);
    }).catch(reject => {
        res.send(reject);
    });
}

async function insert(req, res) {
    const employeeToStore = await employeeService.convertToStore(req.body);

    employeeService.insert(employeeToStore).then(resp => {
        res.send(resp);
    }).catch(reject => {
        res.send(reject);
    });
}

async function update(req, res) {
    employeeService.update(req.params.id, req.body).then(resp => {
        res.send(resp);
    }).catch(reject => {
        res.send(reject);
    });
}

async function login(req, res) {
    employeeService.login(req.body.id, req.body.rfc).then(resp => {
        res.send(resp);
    }).catch(reject => {
        res.send(reject);
    });
}

module.exports = {
    findAll,
    findById,
    insert,
    update,
    login
}