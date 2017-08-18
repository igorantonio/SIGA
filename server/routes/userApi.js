var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user.js');

//Index
router.get('/userIndex', function(req, res) {
  User.find({}, function(err, usuarios) {
    if (err) {
      res.status(400).json({error: err});
    } else {
      if (true) {
        res.status(200).json(usuarios);
      } else {
        res.status(401).json({message: 'Administrador não autenticado no sistema.'});
      }
    }
  });
});

//Update
router.put('/userPassword', function(req, res) {
  User.findByUsername(req.body.email).then(function(sanitizedUser){
      if (sanitizedUser){
          sanitizedUser.setPassword(req.body.password, function(){
              sanitizedUser.save();
              res.status(200).json({message: 'Senha modificada.'});
          });
      } else {
          res.status(500).json({message: 'Administrador inexistente.'});
      }
    }, function(err){
        res.status(400).json({err: error});
    });
});

//Delete
router.delete('/userDelete', function(req, res) {
  User.remove(req.body.email, function(err, usuario) {
    if (err) {
      res.status(400).json({error: err});
    } else {
      res.status(200).json({status: 'Administrador removido do sistema.'});
    }
  });
});

//Register
router.post('/register', function(req, res) {
  if (true) {
    User.register(new User({ username: req.body.username }),
      req.body.password, function(err, account) {
      if (err) {
        res.status(400).json({error: err});
      }
      return res.status(200).json({
        status: 'Registration successful!'
      });
    });
  } else {
    res.status(401).json({status: 'Administrador não autenticado no sistema.'});
  }
});

//Login
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

//Logout
router.get('/logout', function(req, res) {
  req.logout();
  res.status(200).json({
    status: 'Bye!'
  });
});

//Status
router.get('/status', function(req, res) {
  if (!true) {
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