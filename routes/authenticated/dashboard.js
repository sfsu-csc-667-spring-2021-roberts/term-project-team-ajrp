var express = require('express');
var router = express.Router();

const Lobbies = require('../../db/').Lobbies

router.get('/', function (req, res, next) {
    res.render('authenticated/dashboard', { username: req.user.username });
})

router.post('/create-lobby', function (req, res) {
    Lobbies.createLobby(req.user.id);
})

router.get('/lobbies', function (req, res) {
    Lobbies.allLobbies()
        .then(lobby => {
            console.log(lobby);
        })
})

module.exports = router;