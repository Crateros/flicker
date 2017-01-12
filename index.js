//Creates environment variables from .env file
require('dotenv').config();

var express =  require('express');
var ejsLayouts = require('express-ejs-layouts');
var bodyParser = require('body-parser');
var path = require('path');
var db = require('./models');
var session = require('express-session');
var passport = require('./config/ppConfig'); //Access to passport via ppConfig.js
var flash = require('connect-flash');
var isLoggedIn = require('./middleware/isLoggedIn');
var app = express();

app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(ejsLayouts);
app.use(express.static(__dirname + '/public/'));

//Setup for sessions
app.use(session({
  //Limits secret to host memory only or default to 'supersecretpassword'
  //The 'process' makes it globally available
  secret: process.env.SESSION_SECRET || 'supersecretpassword',
  //If no changes happen dont change secret
  resave: false,
  saveUninitialized: true
}));

//This sets up passport to automatically put user info in session storage
//This takes into account the json delete for the password so we dont store password text
//Has to go below session (load order), session comes first
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
  //This makes current user info available in templates
  res.locals.currentUser = req.user;
  res.locals.alerts = req.flash();
  next();
});

app.get('/', function(req, res) {
  res.render('index');
});

//This allows isLoggedIn.js to be called during the app.get
//Profile will show only if user is logged in
app.get('/user/profile', isLoggedIn, function(req, res) {
  console.log("REQUEST FOR USER: ", req.user.id);
  db.user.findOne({
    where: {id: req.user.id}
  })
  .then(function(user) {
    user.getMovies().then(function(movies) {
      res.send(movies);
      // res.render('user/profile', { movies: movies });
    });
  });
});

//Incorporates auth controller
app.use('/auth', require('./controllers/auth'));

//Incorporates media controller
app.use('/media', require('./controllers/media'));

var server = app.listen(process.env.PORT || 3000);

module.exports = server;
