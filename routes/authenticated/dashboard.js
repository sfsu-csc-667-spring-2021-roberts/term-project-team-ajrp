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
	    res.render('authenticated/lobby', {gameName: lobbyInfo.gameName, username: req.user.username});
    })
})

router.get('/lobbies', function (req, res) {
  let results = [];
  Lobbies.allLobbies()
    .then(lobby => {
      lobby.forEach(entry => {
        Object.entries(entry).forEach(([key, value]) => {
          if(key === 'game_name') {
            results.push({game_name: `${value}`})
          }
        })
      })
      res.json(results);
    })
})

module.exports = router;