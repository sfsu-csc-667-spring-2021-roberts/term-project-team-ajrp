var express = require('express');
var router = express.Router();

const game = require('../../db/').Games;

router.get('/createGame', function (req, res) {
    game.createGame(req.session.lobbyID, function(game_id) {
	  	req.session.gameID = game_id;
	    res.json({lobby: req.session.lobbyID, game: game_id});
    })
});

router.get('/g/:gameID', function (req, res) {
    game.joinGame(req.params.gameID, function(gameName) {
	  	req.session.gameID = req.params.gameID;
	  	req.session.gameName = gameName;
	    res.render('authenticated/game', {gameName: req.session.gameName, gameID: req.params.gameID});
    })
});

router.get('/getFirstCards/:gameID/', function (req, res) {
    game.getFirstCards(req.user.id, req.params.gameID, function(cardInfo) {
	    res.json(cardInfo);
    })
});

router.get('/playCard/:gameID/:cardID', function (req, res) {
    game.playCard(req.params.gameID, req.params.cardID, function() {
	    res.json({status: "good"});
    })
});

router.get('/exitGame', function (req, res) {
	game.exitGame(req.user.id, req.session.gameID, function() {
	  	req.session.gameID = null;
	  	req.session.gameName = null;
	  	req.session.lobbyID = null;
	    res.render('authenticated/dashboard');
    })
});

module.exports = router;