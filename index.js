// require('dotenv').config();
var express =  require('express');
var ejsLayouts = require('express-ejs-layouts');
var bodyParser = require('body-parser');
var path = require('path');
var Hashids = require('hashids');
var hashids = new Hashids("This is a super salty hash at 425F!.");
var db = require('./models');
var session = require('express-session');
// var passport = require('./config/ppConfig');
var flash = require('connect-flash');
// var isLoggedIn = require('./middleware/isLoggedIn')
var app = express();

app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(ejsLayouts);
app.use(express.static(__dirname + '/public/'));

//Setup for sessions
// app.use(session({
//   secret: process.env.SESSION_SECRET || 'supersecretpassword',
//   resave: false,
//   saveUninitialized: true
// }));

// app.use(passport.initialize());
// app.use(passport.session());

app.get('/', function(req, res) {
  res.render('layout');
});

var server = app.listen(process.env.PORT || 3000);
