var express = require('express');
var router = express.Router();
var db = require('../models');
var request = require('request');

router.get('/', function(req, res) {
  var netflixUrl = 'http://netflixroulette.net/api/api.php?actor=Zach%20Braff';

  request(netflixUrl, function(error, response, body) {
    console.log(error, response, body);
    var userResult = body;
    //The body is displayed clean in chrome via JSON plugin, not natively
    res.send(body);
    console.log(userResult);
    // console.log(userResult.show_title);
    // res.render('index', { userResult: userResult });
  });
});

module.exports = router;
