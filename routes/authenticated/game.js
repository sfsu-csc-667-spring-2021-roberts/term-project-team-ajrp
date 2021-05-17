var express = require('express');
var router = express.Router();

const game = require('../../db/').Games;

router.get('/createGame/:name/:lobbyID', function (req, res) {
    game.createGame(req.params.lobbyID, req.params.name, function(game_id) {
	    res.json({lobby: req.params.lobbyID, game: game_id});
    })
});

router.get('/g/:gameID/:starter', function (req, res) {
    game.joinGame(req.params.gameID, function(gameName) {
	    res.render('authenticated/game', {gameName: gameName, gameID: req.params.gameID, uid: req.user.id, starter: req.params.starter, uname: req.user.username});
    })
});

router.get('/getFirstCards/:gameID/', function (req, res) {
    game.getFirstCards(req.user.id, req.params.gameID, function(cardInfo) {
	    res.json(cardInfo);
    })
});

router.get('/removePlayer/:gameID/:uid', function (req, res) {
    game.playCard(req.params.gameID, req.params.uid, function() {
	    res.json({status: "good"});
    })
});

router.get('/playCard/:gameID/:cardID', function (req, res) {
    game.playCard(req.params.gameID, req.params.cardID, function() {
	    res.json({status: "good"});
    })
});

router.get('/reshuffleExplode/:gameID/:option', function (req, res) {
	console.log(req.params.option);
    game.reshuffleExplode(req.params.gameID, req.params.option, function() {
	    res.json({status: "good"});
    })
});

router.get('/deck/:gameID/', function (req, res) {
    game.deck(req.user.id, req.params.gameID, function(cardInfo) {
	    res.json(cardInfo);
    })
});

router.get('/getPlayers/:gameID/', function (req, res) {
    game.getPlayers(req.user.id, req.params.gameID, function(players) {
	    res.json(players);
    })
});

router.get('/getEnemyCards/:gameID/', function (req, res) {
    game.getEnemyCards(req.user.id, req.params.gameID, function(ownerInfo) {
	    res.json(ownerInfo);
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