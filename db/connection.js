const pgp = require('pg-promise')();
const QueryFile = pgp.QueryFile;
const path = require('path');

var DBInfo = {
    host: 'localhost', 
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: ''
}
console.log("database url ", JSON.stringify(DBInfo));

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

//const connection = pgp(process.env.DATABASE_URL);
var connection = pgp(DBInfo);

connection.none("CREATE DATABASE csc667").catch(error => {
	if (error.message !== 'database "csc667" already exists') {
    	console.log("ERROR:", error.message || error);
	}
});

DBInfo = {
    host: 'localhost', 
    port: 5432,
    database: 'csc667',
    user: 'postgres',
    password: ''
}

console.log("database url ", JSON.stringify(DBInfo));
connection = pgp(DBInfo);
/*
connection.none("DROP TABLE users CASCADE; DROP TABLE games CASCADE; DROP TABLE lobbies CASCADE; DROP TABLE cards CASCADE; DROP TABLE deck CASCADE;").catch(error => {
		console.log("ERROR:", error.message || error);
});*/

const fullPath = path.join(__dirname, 'dbPrep.sql');
var dbPrep =  new QueryFile(fullPath, { minify: true });
connection.multiResult(dbPrep)
	.then(() => {
		const fillPath = path.join(__dirname, 'prefill.sql');
		dbPrep =  new QueryFile(fillPath, { minify: true });
		connection.none(dbPrep).catch(error => {
			console.log("here ERROR:", error.message || error);
		})
	})
	.catch(error => {
		console.log("ERROR:", error.message || error);
	}
);

module.exports = connection;


