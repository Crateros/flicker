var express = require('express');
var router = express.Router();
var db = require('../models');
var passport = require('../config/ppConfig');

//Show signup page
router.get('/signup', function (req, res) {
  res.render('auth/signup');
});

//Post (create) user info from singup page to database
router.post('/signup', function(req, res, next) {
  db.user.findOrCreate({
    where: {email: req.body.email},
    //This accounts for the other parameters that dont get evaluated in the WHERE
    defaults: {
      name: req.body.name,
      password: req.body.password
    }
    //Pass in user and evaluate if it's created (boolean)
  }).spread(function(user, created) {
    if(created) {
      passport.authenticate('local', {
        successRedirect: '/',
        //Display success message via connect-flash
        successFlash: 'Account creation successful. Welcome to Flicker.',
        //The passport.authenticate needs a request response so we have to pass it here using iffy
      })(req, res, next);
    }
    else {
      req.flash('error', 'Email already exists, please sign in');
      res.redirect('/auth/signup');
    }
  }).catch(function(error) {
    req.flash('error', error.message);
    res.redirect('/auth/signup');
  });
});

router.get('/login', function(req, res) {
  res.render('auth/login');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth/login',
  successFlash: 'Logged In',
  failureFlash: 'Invalid username and/or password'
}));

router.get('/logout', function(req, res) {
  //Passport helper method. removes data from session on logout
  req.logout();
  req.flash('success', 'You have been logged out');
  res.redirect('/');
});

router.get('/facebook', passport.authenticate('facebook', {
  scope: ['public_profile', 'email']
}));



router.get('/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: '/auth/login',
  failureFlash: 'An error occurred, please try later',
  successFlash: 'You have logged in with Facebook'
}));

module.exports = router;
