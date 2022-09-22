const mysql = require('mysql');
const { promisify } = require('util');

const { database } = require('./keys');

const pool = mysql.createPool(database);

pool.getConnection((err, conn) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('DATABASE CONNECTION CLOSED');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('DATABASE HAS TO MANY CONNECTIONS');
        }
        if (err.code == 'ECONNREFUSED') {
            console.error('Database connection status -> DOWN!');
        }
    }

    if (conn) conn.release();
    console.info('Database connection status -> UP!');
    return;
});

pool.query = promisify(pool.query);

module.exports = pool;