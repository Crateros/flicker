var express = require('express');
var router = express.Router();
var async = require('async');
var db = require('../models');
var request = require('request');

var userResults = [];
var totalInfo = [];
var funcs = [];

//Get request details
function getDetails(id, callback) {
  console.log("THIS IS ID INSIDE OF GET getDetails: ", id);
  var url = 'http://www.omdbapi.com/?i=' + id + '&plot=short&r=json';
  request(url, function(error, response, body) {
      callback(null, JSON.parse(body));
  });
}

// //POST query from user search input
// router.post('/', function(req, res) {
//   var omdbUrl = 'http://www.omdbapi.com/?s=' + req.body.search + '&y=&plot=short&r=json';
//
//   request(omdbUrl, function(error, response, body) {
//     userResults = JSON.parse(body).Search;
//     userResults.forEach(function(result) {
//       ids.push(result['imdbID']);
//       return ids;
//     });
//     console.log("THIS IS ids ARRAY", ids);
//     for(i = 0; i < ids.length; i++) {
//       getDetails(ids[i]);
//     }
//     res.render('result', { userResults: userResults });
//   });
// });


//POST query from user search input(async)
router.post('/', function(req, res) {
  var omdbUrl = 'http://www.omdbapi.com/?s=' + req.body.search + '&y=&plot=short&r=json';

  request(omdbUrl, function(error, response, body) {
    userResults = JSON.parse(body).Search;

    var ids = userResults.map(function(result) {
      return result['imdbID'];
    });

    console.log("THIS IS ids ARRAY", ids);

    for(var i = 0; i < ids.length; i++) {
      var id = ids[i];
      console.log("THIS IS ID before getDetails ", id);

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

module.exports = router;
