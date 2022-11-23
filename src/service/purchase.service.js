const Purchase = require('../models/purchase');
const detailPurchaseService = require('./detailPurchase.service');
const supplierService = require('./supplier.service');
const db = require('../database');
const { reject } = require('lodash');

async function findAll() {
    const purchase = [];
    const QUERY = 'select * from compras';

    db.query(QUERY, async (err, qr) => {
        if (err) {
            reject({ status: 500, message: err });
            return;
        }

        if (qr.length > 0) {
            await qr.reduce(async (promise, p) => {
                await promise;
                purchase.push(await convertToSend(p));
            }, Promise.resolve());
        }
    });
}

async function findById(id) {
    return new Promise(async (resolve, reject) => {
        const QUERY = `select * from compras where idCompra = ${id}`;

        db.query(QUERY, async (err, qr) => {
            if (err) {
                reject({ status: 500, message: err });
                return;
            }

            if (qr.length > 0) {
                const purchase = await convertToSend(qr[0]);

                resolve(purchase);
            }
        });
    });
}

async function insert(purchase, details) {
    return new Promise(async (resolve, reject) => {
        db.query(`insert into compras (idProveedor, fecha) values (?)`, [purchase], async (err, qr) => {
            if (err) {
                reject({ status: 500, message: err });
                return;
            }

            if (qr) {
                const detailsToStore = [];

                await details.reduce(async (promise, dp) => {
                    await promise;
                    detailsToStore.push(await detailPurchaseService.convertToStore(dp, qr.insertId));
                }, Promise.resolve());

                detailPurchaseService.insertAll(detailsToStore).then(resp => {
                    if (resp.status === 200) {
                        resolve({ status: 200, message: 'Compra creada' });
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
            toConvert.supplier.id,
            toConvert.date
        ]

        resolve([ ...toStore ]);
    });
}

async function convertToSend(toConvert) {
    return new Promise(async resolve => {
        const purchase = Purchase;

        purchase.id = toConvert.idCompra;
        purchase.supplier = await supplierService.findById(toConvert.idProveedor);
        purchase.date = toConvert.fecha;
        purchase.detailsPurchase = await detailPurchaseService.findByPurchase(purchase.id);

        resolve({ ...purchase });
    });
}

module.exports = {
    findAll,
    findById,
    insert,
    convertToStore,
    convertToSend
}