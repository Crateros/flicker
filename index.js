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

function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}


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
      // res.send(movies);
      // console.log("THIS IS MOVIES!!!!!!!!!!!!!!!!!!!: ", movies);
      user.name = toTitleCase(user.name);
      res.render('user/profile', { movies: movies, user: user });
    });
  });
});



// Delete movie from user and delete movie from movie database if no assocation exists
app.get('/delete/:id', function(req, res){
  console.log("THIS IS REQ USER:", req.user)
  db.user.find({
    where: {
      email: req.user.email
    },
    include: [db.movie]
  }).then(function(user) {
    console.log("THIS IS USER MOVIES !!!:", user.movies);
    db.movie.find({
      where: {
        id: req.params.id
      }
    }).then(function(movie) {
      user.removeMovie(movie).then(function(user) {
        movie.getUsers().then(function(users) {
          console.log("ASSOCIATED USERS!!!: ", users);
          if (users.length === 0) {
            db.movie.destroy ({
              where: {id : req.params.id}
            })
          }
        })
        console.log("updated:", user.movies);
        res.redirect('/user/profile');
      });
    });
  });
});



// // PROTOTYPE UPDATE FUNCTION
// app.get('/edit/:id', function(req, res){
//   console.log("THIS IS REQ USER FOR EDIT!!!!!!!!!!!:", req.user.id)
//
//   db.user.find({
//     where: { id: req.user.id },
//     include: [db.movie]
//   })
//
//   .then(function(user) {
//     console.log("THIS IS USER MOVIES !!!:", req.params.id);
//     db.movie.find({
//       where: { id: req.params.id }
//
//     })
//       .then(function(userMovie) {
//       console.log("UserMovie ID!!!: ", userMovie.id);
//       db.users_movies.update({
//         watched: true,
//         where: {
//           userId: user.id,
//           movieId: userMovie.id }
//       })
//     .then(function(user) {
//         console.log("updated:", user.movies);
//         res.redirect('/user/profile');
//       });
//   });
// });




//PUT edit existing movie to display as watched
// app.get("/edit/:id", function(req, res){
//   db.article.findById(req.params.id).then(function(article){
//   res.render("articles/edit", {article: article});
//   });
// });
//
// app.put("/article/:id", function(req, res){
//   var articleToUpdate = req.params.id;
//   db.article.update({
//      title: req.body.title,
//      content: req.body.content
//    }, {
//      where: { id: articleToUpdate }
//   }).then(function(){
//   res.send();
//   });
// });






//Incorporates auth controller
app.use('/auth', require('./controllers/auth'));

//Incorporates media controller
app.use('/media', require('./controllers/media'));

var server = app.listen(process.env.PORT || 3000);

module.exports = server;
