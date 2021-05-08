const db = require('./connection');

const create = (username, password) => {
    //returns details
    return db.one(
        'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username', [
        username,
        password
    ])
}

const findUsername = (username) => {
    return db.oneOrNone(
        'SELECT username FROM users WHERE username=($1)', [username]
    )
}

const findUser = (username) => {
    return db.oneOrNone(
        'SELECT * FROM users Where username=($1)', [username]
    )
}

module.exports = { create, findUsername, findUser }