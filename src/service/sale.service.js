const Sale = require('../models/sale');
const detailSaleService = require('./detailSale.service');
const employeeService = require('./employee.service');
const productService = require('./product.service');
const db = require('../database');

async function findAll() {
    return new Promise(async (resolve, reject) => {
        const sales = [];
        const QUERY = 'select * from ventas';

        db.query(QUERY, async (err, qr) => {
            if (err) {
                reject({ status: 500, message: err });
                return;
            }

            if (qr.length > 0) {
                await qr.reduce(async (promise, s) => {
                    await promise;
                    sales.push(await convertToSend(s));
                }, Promise.resolve());
            }

            resolve(sales);
        })
    })
}

async function findById(id) {
    return new Promise(async (resolve, reject) => {
        const QUERY = `select * from ventas where idVenta = ${id}`;

        db.query(QUERY, async (err, qr) => {
            if (err) {
                reject({ status: 500, message: err });
                return;
            }

            if (qr.length > 0) {
                const sale = await convertToSend(qr[0]);

                resolve(sale);
            }
        })
    })
}

async function insert(sale, details) {
    return new Promise(async (resolve, reject) => {
        db.query(`insert into ventas (idEmpleado, fecha) values (?)`, [sale], async (err, qr) => {
            if (err) {
                reject({ status: 500, message: err });
                return;
            }

            if (qr) {
                const detailsToStore = [];

                await details.reduce(async (promise, ds) => {
                    await promise;
                    detailsToStore.push(await detailSaleService.convertToStore(ds, qr.insertId));
                }, Promise.resolve());
                
                detailSaleService.insertAll(detailsToStore).then(resp => {
                    if (resp.status === 200) {
                        resolve({status: 200, message: 'Venta creada'});
                    }
                }).catch(rej => {
                    if (rej.status === 500) {
                        reject({ status: 500, message: rej.err });
                    }
                });
            }
        });
    });
}

async function convertToStore(toConvert) {
    return new Promise(async resolve => {
        const toStore = [
            toConvert.employee.id,
            toConvert.date
        ]

        resolve([ ... toStore ]);
    });
}

async function convertToSend(toConvert) {
    return new Promise(async resolve => {
        const sale = Sale;

        sale.id = toConvert.idVenta;
        sale.employee = await employeeService.findById(toConvert.idEmpleado);
        sale.date = toConvert.fecha;
        sale.detailsSale = await detailSaleService.findBySale(sale.id);

        resolve({ ...sale });
    })
}

module.exports = {
    findAll,
    findById,
    insert,
    convertToStore,
    convertToSend
}