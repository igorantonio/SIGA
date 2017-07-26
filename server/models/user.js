// user model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');


var User = new Schema({
  username: {
  	type: String,
  	lowercase: true
  },
  password: {
  	type: String
  },
  created: {
    type: Date,
    default: Date.now
  }
});

User.plugin(passportLocalMongoose);


module.exports = mongoose.model('users', User);