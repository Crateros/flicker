'use strict';
module.exports = function(sequelize, DataTypes) {
  var movie = sequelize.define('movie', {
    title: DataTypes.STRING,
    category: DataTypes.STRING,
    rating: DataTypes.INTEGER,
    poster: DataTypes.STRING,
    runtime: DataTypes.INTEGER,
    date: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.movie.belongsToMany(models.user, {through: "users-movies"})
      }
    }
  });
  return movie;
};
