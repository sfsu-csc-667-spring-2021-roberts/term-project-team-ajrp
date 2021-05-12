var express = require('express');
var router = express.Router();

const Lobbies = require('../../db/').Lobbies

router.get('/', function (req, res, next) {
  res.render('authenticated/dashboard', { username: req.user.username });
})

router.post('/create-lobby', function (req, res) {
  const { lobbyName } = req.body;
  Lobbies.createLobby(lobbyName, req.user.id);
})

router.get('/lobbies', function (req, res) {
  Lobbies.allLobbies()
    .then(lobby => {
      res.json({ game_name: lobby[0].game_name });
      console.log(lobby);
      console.log(lobby[0].game_name);
    })
})

module.exports = router;