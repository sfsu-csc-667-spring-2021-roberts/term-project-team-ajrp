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

module.exports = passport;