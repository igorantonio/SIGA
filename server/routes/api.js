var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user.js');
var Edificio = require('../models/edificio.js');


router.post('/register', function(req, res) {
  if (req.isAuthenticated()) {
    User.register(new User({ username: req.body.username }),
      req.body.password, function(err, account) {
      if (err) {
        return res.status(400).json({
          err: err
        });
      }
      return res.status(200).json({
        status: 'Registration successful!'
      });
    });
  } else {
    res.status(401).json({status: 'Administrador não logado no sistema'});
  }
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(user, function(err) {
      if (err) {
        return res.status(500).json({
          err: 'Could not log in user'
        });
      }
      res.status(200).json({
        status: 'Login successful!'
      });
    });
  })(req, res, next);
});

router.get('/logout', function(req, res) {
  req.logout();
  res.status(200).json({
    status: 'Bye!'
  });
});

router.get('/status', function(req, res) {
  if (!req.isAuthenticated()) {
    return res.status(200).json({
      status: false
    });
  }

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  if (!req.user) {
    res.status(500).json({status: false});
  } else {
    res.status(200).json({status: true, user: req.user});
  }
});

module.exports = router;