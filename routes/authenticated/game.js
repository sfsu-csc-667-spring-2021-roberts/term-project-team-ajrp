var express = require('express');
var router = express.Router();

const game = require('../../db/').Games;

router.get('/startGame', function (req, res) {
    game.createGame(req.session.lobbyID, function(game_id) {
	  	req.session.gameID = game_id;
	    res.render('authenticated/game', {gameName: req.session.gameName});
    })
});

router.get('/cardsOwn', function (req, res) {
	res.send(req.session.cards);
});

router.get('/exitGame', function (req, res) {
	game.exitGame(req.user.id, req.session.gameID, function() {
	  	req.session.gameID = null;
	    res.render('authenticated/dashboard');
    })
});

module.exports = router;