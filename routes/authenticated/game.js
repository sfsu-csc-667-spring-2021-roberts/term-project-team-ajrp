var express = require('express');
var router = express.Router();

const game = require('../../db/').Games;

router.get('/createGame', function (req, res) {
	console.log("here here");
    game.createGame(req.session.lobbyID, function(game_id) {
    	console.log(game_id);
	  	req.session.gameID = game_id;
	    res.send({id: game_id});
    })
});

router.get('/game/:gameID', function (req, res) {
    game.joinGame(req.params.gameID, function(gameName) {
	  	req.session.gameID = req.params.gameID;
	  	req.session.gameName = gameName;
	    res.render('authenticated/game', {gameName: req.session.gameName, gameID: req.params.gameID});
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