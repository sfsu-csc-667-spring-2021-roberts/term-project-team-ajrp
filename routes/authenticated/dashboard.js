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