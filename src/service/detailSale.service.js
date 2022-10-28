const DetailSale = require('../models/detailSale');
const productService = require('../service/product.service');
const db = require('../database');

async function insertAll(detailsSale) {
    return new Promise(async (resolve, reject) => {
        db.query(`insert into detalle_ventas (idVenta, idProducto, precio, cantidad) values ?`, [detailsSale], async (err, qr) => {
            if (err) {
                reject({ status: 500, message: err });
                return;
            }

            if (qr) resolve ({ status: 200 });
        });
    });
}

async function findBySale(idSale) {
    return new Promise(async (resolve, reject) => {
        const detailsSale = [];
        const QUERY = `select * from detalle_ventas where idVenta = ${idSale}`;

        db.query(QUERY, async (err, qr) => {
            if (err) {
                reject({ status: 500, message: err });
                return;
            }

            if (qr.length > 0) {
                await qr.reduce(async (promise, ds) => {
                    await promise;
                    detailsSale.push(await convertToSend(ds));
                }, Promise.resolve());

                resolve(detailsSale);
            }
        });
    });
}

async function convertToStore(toConvert, idSale) {
    return new Promise(async resolve => {
        const toStore = [
            idSale,
            toConvert.product.id,
            toConvert.price,
            toConvert.amount
        ]

        resolve([ ...toStore ]);
    });
}

async function convertToSend(toConvert) {
    return new Promise(async resolve => {
        const detailSale = DetailSale;

        detailSale.id = toConvert.idDetalle_venta;
        detailSale.product = await productService.findById(toConvert.idProducto);
        detailSale.price = toConvert.precio;
        detailSale.amount = toConvert.cantidad;

        resolve({ ...detailSale });
    });
}

module.exports = {
    insertAll,
    findBySale,
    convertToStore,
    convertToSend
}