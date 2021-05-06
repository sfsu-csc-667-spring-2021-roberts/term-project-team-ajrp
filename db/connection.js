const pgp = require('pg-promise')();

console.log("database url ", process.env.DATABASE_URL)

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const connection = pgp(process.env.DATABASE_URL);

module.exports = connection;