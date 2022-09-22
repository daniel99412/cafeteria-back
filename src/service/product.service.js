const Product = require('../models/product');
const db = require('../database');

async function findAll() {
    return new Promise(async (resolve, reject) => {
        const products = [];
        const QUERY = 'select * from productos';

        db.query(QUERY, async (err, qr) => {
            if (err) {
                reject({ status: 500, message: err });
                return;
            }

            if (qr.length > 0) {
                await qr.reduce(async (promise, p) => {
                    await promise;
                    products.push(await {...convertToSend(p)});
                }, Promise.resolve());
            }

            resolve(products);
        });
    });
}

async function findById(id) {
    return new Promise(async (resolve, reject) => {
        const QUERY = `select * from productos where idProducto = ${id}`;

        db.query(QUERY, async (err, qr) => {
            if (err) {
                reject({ status: 500, message: err });
                return;
            }

            if (qr.length > 0) {
                var product = await convertToSend(qr[0]);

                resolve(product);
            } else {
                reject({ status: 500, message: `No existe producto con el id ${id}` });
                return;
            }
        });
    });
}

async function insert(product) {
    return new Promise(async (resolve, reject) => {
        db.query(`insert into productos (nombre, precio, cantidad_disponible, descripcion) values (?)`, [product], async (err, resp) => {
            if (err) {
                reject({ status: 500, message: err });
                return;
            }

            if (resp) resolve({ status: 200, message: 'Producto creado' });
        });
    });
}

async function update(id, product) {
    return new Promise(async (resolve, reject) => {
        await findById(id).then(async resp => {
            var productInDb = resp;

            product.name ? productInDb.name = product.name : productInDb.name = productInDb.name;
            product.price ? productInDb.price = product.price : productInDb.price = productInDb.price;
            product.description ? productInDb.description = product.description : productInDb.description = productInDb.description;

            if ('status' in product) {
                product.status === 1 ? productInDb.isActive = true : productInDb.isActive = false;
            }

            if ('amountAvailable' in product) {
                productInDb.amountAvailable = product.amountAvailable;
            }

            db.query(`update productos set nombre = '${productInDb.name}', precio = ${productInDb.price}, cantidad_disponible = ${productInDb.amountAvailable}, descripcion = '${productInDb.description}', estado = ${productInDb.isActive} where idProducto = ${productInDb.id}`,
                async (err, resp) => {
                    if (err) {
                        reject({ status: 500, message: err });
                        return;
                    }

                    if (resp) resolve({ status: 200, message: 'Producto modificado' });
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
            toConvert.price,
            toConvert.amountAvailable,
            toConvert.description,
        ]

        resolve([ ...toStore ]);
    });
}

async function convertToSend(toConvert) {
    return new Promise(async resolve => {
        const product = Product;

        product.id = toConvert.idProducto;
        product.name = toConvert.nombre;
        product.price = toConvert.precio;
        product.amountAvailable = toConvert.cantidad_disponible;
        product.description = toConvert.descripcion;
        
        if (toConvert.estado === 1) {
            product.isActive = true;
        } else {
            product.isActive = false;
        }

        resolve({ ...product });
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
