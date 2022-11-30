const ProductIngredient = require('../models/productIngredient');
const productService = require('../service/product.service');
const ingredientService = require('../service/ingredient.service');
const db = require('../database');

async function findById(id) {
    return new Promise(async (resolve, reject) => {
        const QUERY = `select * from ingredientes_productos where id = ${id}`;

        db.query(QUERY, async (err, qr) => {
            if (err) {
                reject({ status: 500, message: err });
                return;
            }

            if (qr.length > 0) {
                const productIngredient = await convertToSend(qr[0]);

                resolve(productIngredient);
            } else {
                reject({ status: 500, message: `No existe` });
                return;
            }
        });
    });
}

async function findByProduct(idProduct) {
    return new Promise(async (resolve, reject) => {
        const productIngredient = [];
        const QUERY = `select * from ingredientes_productos where idProducto = ${idProduct}`;

        db.query(QUERY, async (err, qr) => {
            if (err) {
                reject({ status: 500, message: err });
                return;
            }

            if (qr.length > 0) {
                await qr.reduce(async (promise, pi) => {
                    await promise;
                    productIngredient.push(await convertToSend(pi));
                }, Promise.resolve());

                resolve(productIngredient);
            }
        });
    });
}

async function insertAll(productIngredient) {
    return new Promise(async (resolve, reject) => {
        db.query(`insert into ingredientes_productos (idProducto, idIngrediente, cantidad) values ?`, [productIngredient], async (err, qr) => {
            if (err) {
                reject({ status: 500, message: err });
                return;
            }

            if (qr) resolve({ status: 200 });
        });
    });
}

async function update(id, productIngredient) {
    return new Promise(async (resolve, reject) => {
        await findById(id).then(async resp => {
            var productIngredientInDb = resp;

            productIngredient.product ? productIngredientInDb.product = productIngredient.product : productIngredientInDb.product;
            productIngredient.ingredient ? productIngredientInDb.ingredient = productIngredient.ingredient : productIngredientInDb.ingredient;
            productIngredient.amount ? productIngredientInDb.amount = productIngredient.amount : productIngredientInDb.amount;

            db.query(`upate ingredientes_productos set idProducto = ${productIngredientInDb.product.id}, idIngrediente = ${productIngredientInDb.ingredient.id}, amount = ${productIngredientInDb.amount} where idIngrediente_producto = ${productIngredientInDb.id}`,
                async (err, resp) => {
                    if (err) {
                        reject({ status: 500, message: err });
                        return;
                    }

                    if (resp) resolve({ status: 200, message: 'Actualizado' });
                });
        }).catch(rej => {
            reject(rej);
            return;
        });
    })
}

async function convertToStore(toConvert, idProduct) {
    return new Promise(async resolve => {
        const toStore = [
            idProduct,
            toConvert.ingredient.id,
            toConvert.amount
        ]

        resolve([ ...toStore ]);
    });
}

async function convertToSend(toConvert) {
    return new Promise(async resolve => {
        const productIngredient = ProductIngredient;
    
        productIngredient.id = toConvert.idIngrediente_producto;
        productIngredient.product = { 'id': toConvert.idProducto };
        productIngredient.ingredient = await ingredientService.findById(toConvert.idIngrediente);
        productIngredient.amount = toConvert.cantidad;
    
        resolve({ ...productIngredient });
    });
}

module.exports = {
    findByProduct,
    insertAll,
    update,
    convertToStore,
    convertToSend
}