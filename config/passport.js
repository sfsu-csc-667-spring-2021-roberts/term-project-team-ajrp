let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let bcrypt = require('bcrypt');
const Users = require('../db').Users;

passport.use(new LocalStrategy(
  function (username, password, done) {
    Users.findUser(username)
      .then((user) => {
        bcrypt.compare(password, user.password)
          .then(valid => {
            if (valid) {
              return done(null, user);
            }
            else {
              return done(null, false, { message: `Username and password don't match` });
            }
          });
      })
      .catch(() => {
        return done(null, false, { message: `User does not exists` });
      })
  }
));

// session usage
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  Users.findById(id)
    .then((user) => {
      return done(null, user);
    })
    .catch((error) => {
      return done(error, null);
    })
});

module.exports = passport;