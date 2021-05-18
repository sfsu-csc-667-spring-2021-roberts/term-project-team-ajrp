var express = require('express');
var router = express.Router();
var io = require('../../config/server').io;

const Lobbies = require('../../db/').Lobbies

router.get('/', function (req, res, next) {
  res.render('authenticated/dashboard', {username: req.user.username});
})

router.get('/createLobby', function (req, res) {
  Lobbies.createLobby(req.user.id, req.user.username, function(lobbyInfo) {
    res.json(lobbyInfo);
  })
})

router.get('/lobby/:lobbyID', function (req, res) {
  Lobbies.joinLobby(req.user.id, req.params.lobbyID, function(gameName) {
    res.render('authenticated/lobby', {lobby_id: req.params.lobbyID, gameName: gameName.game_name, username: req.user.username, player_id: req.user.id, exitLink: '/dashboard/exitLobby/'+req.params.lobbyID});
  });
})

router.get('/lobbies', function (req, res) {
  Lobbies.allLobbies(function(lobbiesInfo) {
    res.json(lobbiesInfo);
  });
})

router.get('/getMembers/:lobbyID', function (req, res) {
  Lobbies.getMembers(req.params.lobbyID, function(lobbiesInfo) {
    res.json(lobbiesInfo);
  });
})

router.get('/exitLobby/:lobbyID', function (req, res) {
  Lobbies.exitLobby(req.user.id, req.params.lobbyID, function() {
    res.redirect('/dashboard');
  })
})

module.exports = router;