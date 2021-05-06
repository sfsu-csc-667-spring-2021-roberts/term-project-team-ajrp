var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/register', function(req, res, next) {
  res.render('unauthenticated/register', { });
});

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

  if(!errors.length == 0) {
    res.render('unauthenticated/register', { errors });
  }
  else {
    
  }

});

module.exports = router;