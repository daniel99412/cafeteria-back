const Ingredient = require('../models/igredient');
const db = require('../database');

async function findAll() {
    return new Promise(async (resolve, reject) => {
        const ingredients = [];
        const QUERY = 'select * from ingredientes';

        db.query(QUERY, async (err, qr) => {
            if (err) {
                reject({ status: 500, message: err });
                return;
            }

            if (qr.length > 0) {
                await qr.reduce(async (promise, i) => {
                    await promise;
                    ingredients.push(await convertToSend(i));
                }, Promise.resolve());
            }

            resolve(ingredients);
        });
    });
}

async function findById(id) {
    return new Promise(async (resolve, reject) => {
        const QUERY = `select * from ingredientes where idIngrediente = ${id}`;

        db.query(QUERY, async (err, qr) => {
            if (err) {
                reject({ status: 500, message: err });
                return;
            }

            if (qr.length > 0) {
                var ingredient = await convertToSend(qr[0]);
                resolve(ingredient);
            } else {
                reject({ status: 500, message: `No existe ingrediente con id ${id}` });
                return;
            }
        });
    });
}

async function insert(ingredient) {
    return new Promise(async (resolve, reject) => {
        db.query(`insert into ingredientes (nombre, cantidad_disponible) values (?)`, [ingredient], async (err, qr) => {
            if (err) {
                reject({ status: 500, message: err });
                return;
            }

            if (qr) resolve({ status: 200, message: 'Ingrediente agregado' });
        });
    });
}

async function update(id, ingredient) {
    return new Promise(async (resolve, reject) => {
        findById(id).then(async resp => {
            var ingredientInDb = resp;

            ingredient.name ? ingredientInDb.name = ingredient.name : ingredientInDb.name = ingredientInDb.name;

            if ('amountAvailable' in ingredient) {
                ingredientInDb.amountAvailable = ingredient.amountAvailable;
            }

            db.query(`update ingredientes set nombre = '${ingredientInDb.name}', cantidad_disponible = ${ingredientInDb.amountAvailable} where idIngrediente = ${id}`,
                async (err, qr) => {
                    if (err) {
                        reject({ status: 500, message: err });
                        return;
                    }

                    if (qr) resolve({ status: 200, message: 'Ingrediente modificado' });
                })
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
            toConvert.amountAvailable
        ]

        resolve([ ...toStore ]);
    });
}

async function convertToSend(toConvert) {
    return new Promise(async resolve => {

        const ingredient = Ingredient;
    
        ingredient.id = toConvert.idIngrediente;
        ingredient.name = toConvert.nombre;
        ingredient.amountAvailable = toConvert.cantidad_disponible;
    
        resolve({ ...ingredient });
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
