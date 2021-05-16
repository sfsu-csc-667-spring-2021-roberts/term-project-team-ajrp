const pgp = require('pg-promise')();
const QueryFile = pgp.QueryFile;
const path = require('path');

console.log("database url ", process.env.DATABASE_URL);

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const connection = pgp(process.env.DATABASE_URL);

module.exports = connection;


