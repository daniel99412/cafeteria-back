const DetailPurchase = require('../models/detailPurchase');
const productService = require('../service/product.service');
const db = require('../database');

async function insertAll(detailsPurchase) {
    return new Promise(async (resolve, reject) => {
        db.query(`insert into detalle_compras (idCompra, idProducto, precio, cantidad) values ?`, [detailsPurchase], async (err, qr) => {
            if (err) {
                reject({ status: 500, message: err });
                return;
            }

            if (qr) resolve({ status: 200 });
        });
    });
}

async function findByPurchase(idPurchase) {
    return new Promise(async (resolve, reject) => {
        const detailsPurchase = [];
        const QUERY = `select * from detalle_compras where idCompra = ${idPurchase}`;

        db.query(QUERY, async (err, qr) => {
            if (err) {
                reject({ status: 500, message: err });
                return;
            }

            if (qr.length > 0) {
                await qr.reduce(async (promise, dp) => {
                    await promise;
                    detailsPurchase.push(await convertToSend(dp));
                }, Promise.resolve());

                resolve(detailsPurchase);
            }
        });
    });
}

async function convertToStore(toConvert, idPurchase) {
    return new Promise(async resolve => {
        const toStore = [
            idPurchase,
            toConvert.product.id,
            toConvert.price,
            toConvert.amount
        ]

        resolve([ ...toStore ]);
    });
}

async function convertToSend(toConvert) {
    return new Promise(async resolve => {
        const detailPurchase = DetailPurchase;

        detailPurchase.id = toConvert.id_detalle_compra;
        detailPurchase.product = await productService.findById(toConvert.idProducto);
        detailPurchase.price = toConvert.precio;
        detailPurchase.amount = toConvert.cantidad;

        resolve({ ...detailPurchase });
    });
}

module.exports = {
    insertAll,
    findByPurchase,
    convertToStore,
    convertToSend
}