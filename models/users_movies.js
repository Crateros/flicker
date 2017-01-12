'use strict';
module.exports = function(sequelize, DataTypes) {
  var users_movies = sequelize.define('users_movies', {
    userId: DataTypes.INTEGER,
    movieId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return users_movies;
};