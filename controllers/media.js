var express = require('express');
var router = express.Router();
var async = require('async');
var db = require('../models');
var request = require('request');
var flash = require('connect-flash');
var isLoggedIn = require('../middleware/isLoggedIn');

var userResults = [];
var totalInfo = [];
var funcs = [];

//This gets request details(imdbID) and constructs new url for async request for each id
function getDetails(id, callback) {
  console.log("THIS IS ID INSIDE OF GET getDetails: ", id);
  var url = 'http://www.omdbapi.com/?i=' + id + '&plot=short&r=json';
  request(url, function(error, response, body) {
      callback(null, JSON.parse(body));
  });
}

//POST query from user search input(async)
router.post('/', function(req, res) {
  console.log("THIS IS QUERY: ", req.body.search);
  funcs = [];
  var omdbUrl = 'http://www.omdbapi.com/?s=' + req.body.search + '&y=&plot=short&r=json';

  request(omdbUrl, function(error, response, body) {
    userResults = JSON.parse(body).Search;

    var ids = userResults.map(function(result) {
      return result['imdbID'];
    });

    console.log("THIS IS ids ARRAY", ids);

    for(var i = 0; i < ids.length; i++) {
      var id = ids[i];

      var func = (function(id) {
        return function(callback) {
          getDetails(id, callback);
        }
      })(id);

      funcs.push(func);
    }

    async.parallel(funcs, function(err, results) {
      // console.log("FINAL RESULTS! ", results);
      res.render('result', { userResults: results });
    });
  });
});

//POST - create a new movie entry with user relationship
router.post('/save', isLoggedIn, function(req, res, next) {
  console.log("THIS IS MOVIE TO SAVE: ", req.body);
  //Checks to see if user exists
  db.user.findOrCreate({
    where: { email: req.user.email}
    //Legit user can no find or create a movie entry
  }).spread(function(user, created) {
    db.movie.findOrCreate({
      where: {title: req.body.title},
      //This accounts for the other parameters that dont get evaluated in the WHERE
      defaults: {
        category: req.body.category,
        rating: req.body.rating,
        poster: req.body.poster,
        runtime: req.body.runtime,
        date: req.body.date
      }
    //Joins legit user and created movie entry
  }).spread(function(movie, created) {
    user.addMovie(movie);
    req.flash('success', 'Movie added');
  });
    console.log("movie added!", req.body.title);
    req.flash('success', 'Movie added');
    res.redirect('/');
  });
});

module.exports = router;
