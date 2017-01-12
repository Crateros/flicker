// Strict mode, can't use undeclared variables
'use strict';

var bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define('user', {
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: 'Invalid email address'
        }
      }
    },
    name: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [1, 99],
          msg: 'Name must be between 1 and 99 characters long'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [8, 99],
          msg: 'Password must be between 8 and 99 characters long'
        }
      }
    },
    facebookId: {
      type: DataTypes.STRING
    },
    facebookToken: {
      type: DataTypes.STRING
    }
  }, {
    hooks: {
      beforeCreate: function(createdUser, options, callback) {
        //Catch for Facebook OAuth in case user does not provide custom password (password is undefined)
        if(createdUser.password != undefined) {
          //Use Sync in order to wait for bcrypt to finish hashing before you continue
          var hash = bcrypt.hashSync(createdUser.password, 10);
          createdUser.password = hash;
        }
        callback(null, createdUser);
      }
    },
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.user.belongsToMany(models.movie, {through: "users_movies"})
      }
    },
    instanceMethods: {
      validPassword: function(password) {
        console.log("THIS IS THE PASSWORD")
        //password is user entered, this.password is password from database for comparison
        var encryptPas = bcrypt.compareSync(password, this.password);
        console.log("THIS PASS is valid:", encryptPas);
        return bcrypt.compareSync(password, this.password);
      },
      toJSON: function() {
        //This gets user object from database
        var jsonUser = this.get();
        //This removes the password from that object so its not stored on client
        delete jsonUser.password
        return jsonUser;
      }
    }
  });
  return user;
};
