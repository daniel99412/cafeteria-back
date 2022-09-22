const Employee = require('../models/employee');
const db = require('../database');
const moment = require('moment');

async function findAll() {
    return new Promise(async (resolve, reject) => {
        const employees = [];
        const QUERY = 'select * from empleados';

        db.query(QUERY, async (err, qr) => {
            if (err) {
                reject({ status: 500, message: err });
                return;
            }

            if (qr.length > 0) {
                await qr.reduce(async (promise, e) => {
                    await promise;
                    employees.push(await { ...convertToSend(e) });
                }, Promise.resolve());
            }

            resolve(employees);
        });
    });
}

async function findById(id) {
    return new Promise(async (resolve, reject) => {
        const QUERY = `select * from empleados where idEmpleado = ${id}`;

        db.query(QUERY, async (err, qr) => {
            if (err) {
                reject({ status: 500, message: err });
                return;
            }

            if (qr.length > 0) {
                var employee = await convertToSend(qr[0]);

                resolve(employee);
            } else {
                reject({ status: 500, message: `No existe empleado con el id ${id}` });
                return;
            }
        });
    });
}

async function insert(employee) {
    return new Promise(async (resolve, reject) => {
        db.query(`insert into empleados (nombre, rfc, fecha_nacimiento, domicilio, telefono, puesto) values (?)`, [employee], async (err, qr) => {
            if (err) {
                reject({ status: 500, message: err });
                return;
            }

            if (qr) resolve({ status: 200, message: 'Empleado creado' });
        });
    });
}

async function update(id, employee) {
    return new Promise(async (resolve, reject) => {
        findById(id).then(async resp => {
            var employeeInDb = resp;

            employee.name ? employeeInDb.name = employee.name : employeeInDb.name = employeeInDb.name;
            employee.rfc ? employeeInDb.rfc = employee.rfc : employeeInDb.rfc = employeeInDb.rfc;
            employee.birthdate ? employeeInDb.birthdate = employee.birthdate : employeeInDb.birthdate = employeeInDb.birthdate;
            employee.address ? employeeInDb.address = employee.address : employeeInDb.address = employeeInDb.address;
            employee.telephone ? employeeInDb.telephone = employee.telephone : employeeInDb.telephone = employeeInDb.telephone;
            employee.position ? employeeInDb.position = employee.position : employeeInDb.position = employeeInDb.position;
            
            if ('status' in employee) {
                employee.status === 1 ? employeeInDb.isActive = true : employeeInDb.isActive = false;
            }

            db.query(`update empleados set nombre = '${employeeInDb.name}', rfc = '${employeeInDb.rfc}', fecha_nacimiento = '${moment(employeeInDb.birthdate).format('YYYY-MM-DD')}', domicilio = '${employeeInDb.address}', telefono = '${employeeInDb.telephone}', puesto = '${employeeInDb.position}', estado = ${employeeInDb.isActive} where idEmpleado = ${id}`,
                async (err, resp) => {
                    if (err) {
                        reject({ status: 500, message: err });
                        return;
                    }

                    if (resp) resolve({ status: 200, message: 'Empleado modificado' });
                });
        }).catch(rej => {
            reject(rej);
            return;
        });
    });
}

async function convertToStore(toConvert) {
    return new Promise(async resolve => {
        const toStore = [
            toConvert.name,
            toConvert.rfc,
            toConvert.birthdate,
            toConvert.address,
            toConvert.telephone,
            toConvert.position
        ]

        resolve([ ...toStore ]);
    });
}

async function convertToSend(toConvert) {
    return new Promise(async resolve => {
        const employee = Employee;

        employee.id = toConvert.idEmpleado;
        employee.name = toConvert.nombre;
        employee.rfc = toConvert.rfc;
        employee.birthdate = toConvert.fecha_nacimiento;
        employee.address = toConvert.domicilio;
        employee.telephone = toConvert.telefono;
        employee.position = toConvert.puesto;

        if (toConvert.estado === 1) {
            employee.isActive = true;
        } else {
            employee.isActive = false;
        }

        resolve({ ...employee });
    });
}

module.exports = {
    findAll,
    findById,
    insert,
    update,
    convertToStore,
    convertToSend
}
