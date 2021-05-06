var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');

const Users = require('../../db').Users;

/* GET home page. */
router.get('/register', function(req, res, next) {
  res.render('unauthenticated/register', { });
});

/* client POST */
router.post('/register', function(req, res, next) {
  const { username, password, confirmPassword} = req.body;

  const errors = [];

  if(!username || !password || !confirmPassword) {
    errors.push(['Please enter all fields']);
  }
  else if (password < 8) {
    errors.push("Password must be at least 8 characters");
  }
  else if (confirmPassword != password) {
    errors.push("Make sure your passwords match");
  }

  Users.findUsername(username)
    .then(user => {
      console.log(user);
      console.log(user.username);
      if(username === user.username) {
        console.log("test");
        return errors.push("Username taken!");
      }
    })
    .catch(() => {console.log("Validation passed")})

  console.log(errors.length);
  if(errors.length != 0) {
    res.render('unauthenticated/register', { errors });
  }
  else {
    bcrypt.hash(password, 10)
      .then((hashedPassword) => Users.create(username, hashedPassword))
      .then(() => res.render('authenticated/dashboard'))
      .catch(() => res.render('unauthenticated/register'), { errors: ['Failed to create new user, please try again'] })
  }
});

module.exports = router;