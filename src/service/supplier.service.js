const Supplier = require('../models/supplier');
const db = require('../database');

async function findAll() {
    return new Promise(async (resolve, reject) => {
        const suppliers = [];
        const QUERY = 'select * from proveedores';

        db.query(QUERY, async (err, qr) => {
            if (err) {
                reject({ status: 500, message: err });
                return;
            }

            if (qr.length > 0) {
                await qr.reduce(async (promise, s) => {
                    await promise;
                    suppliers.push(await convertToSend(s));
                }, Promise.resolve());
            }

            resolve(suppliers);
        });
    });
}

async function findById(id) {
    return new Promise(async (resolve, reject) => {
        const QUERY = `select * from proveedores where idProveedor = ${id}`;

        db.query(QUERY, async (err, qr) => {
            if (err) {
                reject({ status: 500, message: err });
                return;
            }

            if (qr.length > 0) {
                var supplier = await convertToSend(qr[0]);

                resolve(supplier);
            } else {
                reject({ status: 500, message: `No existe proveedor con el id ${id}` });
                return;
            }
        });
    });
}

async function insert(supplier) {
    return new Promise(async (resolve, reject) => {
        db.query(`insert into proveedores (nombre, domicilio, telefono, rfc) values (?)`, [supplier], async (err, qr) => {
            if (err) {
                reject({ status: 500, message: err });
                return;
            }

            if (qr) resolve({ status: 200, message: 'Proveedor creado' });
        });
    });
}

async function update(id, supplier) {
    return new Promise(async (resolve, reject) => {
        findById(id).then(async resp => {
            var supplierInDb = resp;

            supplier.name ? supplierInDb.name = supplier.name : supplierInDb.name = supplierInDb.name;
            supplier.address ? supplierInDb.address = supplier.address : supplierInDb.address = supplierInDb.address;
            supplier.telephone ? supplierInDb.telephone = supplier.telephone : supplierInDb.telephone = supplierInDb.telephone;
            supplier.rfc ? supplierInDb.rfc = supplier.rfc : supplierInDb.rfc = supplierInDb.rfc;

            db.query(`update empleados set nombre = '${supplierInDb.name}', domicilio = '${supplierInDb.address}', telefono = '${supplierInDb.telephone}', rfc = '${supplierInDb.rfc}' where id = ${supplierInDb.id}`,
                async (err, resp) => {
                    if (err) {
                        reject({ status: 500, message: err });
                        return;
                    }

                    if (resp) resolve({ status: 200, message: 'Proveedor modificado' });
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
            toConvert.address,
            toConvert.telephone,
            toConvert.rfc
        ]

        resolve([ ...toStore ]);
    });
}

async function convertToSend(toConvert) {
    return new Promise(async resolve => {
        const supplier = Supplier;

        supplier.id = toConvert.idProveedor;
        supplier.name = toConvert.nombre;
        supplier.address = toConvert.domicilio;
        supplier.telephone = toConvert.telefono;
        supplier.rfc = toConvert.rfc;

        resolve({ ...supplier });
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