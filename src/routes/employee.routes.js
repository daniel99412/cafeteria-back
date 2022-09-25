const express = require('express');
const router = express.Router();
const EmployeeController = require('../controllers/employee.controller');

router.post('/', EmployeeController.insert);
router.post('/login', EmployeeController.login);
router.get('/', EmployeeController.findAll);
router.get('/:id', EmployeeController.findById);
router.put('/:id', EmployeeController.update);

module.exports = router;