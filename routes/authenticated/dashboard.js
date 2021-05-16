var express = require('express');
var router = express.Router();
var io = require('../../config/server').io;

const Lobbies = require('../../db/').Lobbies

router.get('/', function (req, res, next) {
    res.render('authenticated/dashboard', {username: req.user.username});
})

router.post('/create-lobby', function (req, res) {
    Lobbies.createLobby(req.user.id, req.user.username, function(lobbyInfo) {
	  	req.session.lobbyID = lobbyInfo.id;
	  	req.session.gameName = lobbyInfo.gameName;
	    res.render('authenticated/lobby', {lobby_id: lobbyInfo.id, gameName: lobbyInfo.gameName, username: req.user.username});
    })
})

function getLobbyNames(lobbies, next) {
  let results = [];
  var itemsProcessed = 0;
  lobbies.forEach(entry => {
    itemsProcessed += 1;
    Object.entries(entry).forEach(([key, value]) => {
      if(key === 'game_name') {
        results.push({game_name: `${value}`})
      }
      if(itemsProcessed === lobbies.length) {
        next(results);
      }
    })
  })
}

router.get('/lobbies', function (req, res) {
  Lobbies.allLobbies(function(lobby) {
    getLobbyNames(lobby, function(results) {
      res.send(results);
    })
  });
})

module.exports = router;