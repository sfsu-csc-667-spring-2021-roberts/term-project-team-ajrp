const db = require('./connection');

const create = (username, password) => {
    //returns details
    return db.one(
        'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username', [
            username,
            password
        ])
}

module.exports = { create }