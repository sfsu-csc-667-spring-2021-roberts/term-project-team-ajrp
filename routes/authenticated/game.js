var express = require('express');
var router = express.Router();

const game = require('../../db/').Game

router.get('/', function (req, res, next) {
    res.render('authenticated/dashboard', {username: req.user.username});
});

router.post('/startGame', function (req, res) {
    game.createGame(req.user.id, req.session.lobbyID, function(lobbyInfo) {
	  	req.session.lobbyID = lobbyInfo.id;
	    res.render('authenticated/lobby', {gameName: lobbyInfo.gameName, username: req.user.username});
    })
});

router.get('/lobbies', function (req, res) {
    Lobbies.allLobbies()
        .then(lobby => {
            console.log(lobby);
        })
});

module.exports = router;