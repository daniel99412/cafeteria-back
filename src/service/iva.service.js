const Iva = require('../models/iva');
const db = require('../database');
const moment = require('moment');
const { update } = require('lodash');

async function findAll() {
    return new Promise(async (resolve, reject) => {
        const ivas = [];
        const QUERY = 'select * from iva';

        db.query(QUERY, async (err, qr) => {
            if (err) {
                reject({ status: 500, message: err });
                return;
            }

            if (qr.length > 0) {
                await qr.reduce(async (promise, i) => {
                    await promise;
                    ivas.push(await convertToSend(i));
                }, Promise.resolve());
            }

            resolve(ivas);
        });
    });
}

async function findById(id) {
    return new Promise(async (resolve, reject) => {
        const QUERY = `select * from iva where idIva = ${id}`;

        db.query(QUERY, async (err, qr) => {
            if (err) {
                reject({ status: 500, message: err });
                return;
            }

            if (qr.length > 0) {
                var iva = await convertToSend(qr[0]);

                resolve(iva);
            } else {
                reject({ status: 500, message: `No existe iva con el id ${id}` });
                return;
            }
        })
    })
}

async function insert(iva) {
    return new Promise(async (resolve, reject) => {
        db.query(`insert into iva (iva, fecha_inicio) values (?)`, [iva], async (err, qr) => {
            if (err) {
                reject({ status: 500, message: err });
                return;
            }

            if (qr) resolve({ status: 200, message: 'IVA creado' });
        });
    });
}

async function update(id, iva) {
    return new Promise(async (resolve, reject) => {
        findById(id).then(async resp => {
            var ivaInDb = resp;

            if ('iva' in iva) ivaInDb.iva = iva.iva;
            iva.dateStart ? ivaInDb.dateStart = iva.dateStart : ivaInDb.dateStart = ivaInDb.dateStart;

            db.query(`update iva set iva = ${ivaInDb.iva}, fecha_inicio = '${moment(ivaInDb.dateStart).format('YYYY-MM-DD')}' where idIva = ${id}`,
                async (err, qr) => {
                    if (err) {
                        reject({ status: 500, message: err });
                        return;
                    }

                    if (qr) resolve({ status: 200, message: 'IVA modificado' });
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
            toConvert.iva,
            toConvert.dateStart
        ]

        resolve([ ...toStore ]);
    });
}

async function convertToSend(toConvert) {
    return new Promise(async resolve => {
        const iva = Iva;

        iva.id = toConvert.idIva;
        iva.iva = toConvert.iva;
        iva.dateStart = toConvert.fecha_inicio;

        resolve({ ...iva });
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
