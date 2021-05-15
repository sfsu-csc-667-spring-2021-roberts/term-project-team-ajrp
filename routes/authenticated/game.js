var express = require('express');
var router = express.Router();

const game = require('../../db/').Games;

router.get('/startGame', function (req, res) {
    game.createGame(req.session.lobbyID, function(game_id) {
	  	req.session.gameID = game_id;
	    res.render('authenticated/game');
    })
});

router.get('/exitGame', function (req, res) {
	game.exitGame(req.user.id, req.session.gameID, function() {
	  	req.session.gameID = null;
	    res.render('authenticated/dashboard');
    })
});

module.exports = router;