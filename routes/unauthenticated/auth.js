var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');

const Users = require('../../db').Users;

const passport = require('../../config/passport');

/* GET register */
router.get('/register', function (req, res, next) {
  res.render('unauthenticated/register', {});
});

/* POST register */
router.post('/register', function (req, res, next) {
  const { username, password, confirmPassword } = req.body;
  const errors = [];

  if (!username || !password || !confirmPassword) {
    errors.push(['Please enter all fields']);
  }
  else if (password.length < 8) {
    errors.push("Password must be at least 8 characters");
  }
  else if (confirmPassword != password) {
    errors.push("Make sure your passwords match");
  }

  if (errors.length != 0) {
    res.render('unauthenticated/register', { errors });
  }
  else {
    Users.findUsername(username)
      .then(user => {
        if (user) {
          res.render('unauthenticated/register', { errors: ['Username taken!'] });
        }
        else {
          bcrypt.hash(password, 10)
            .then((hashedPassword) => Users.create(username, hashedPassword))
            .then(() => res.redirect('/login'))
            .catch(() => res.render('unauthenticated/register'), { errors: ['Failed to create new user, please try again'] })
        }
      })
  }
});

/* GET login */
router.get('/login', function (req, res, next) {
  res.render('unauthenticated/login', {});
});

/* POST login */
router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
  })
);

router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
})

module.exports = router;