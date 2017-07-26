var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');
var User = require('../models/user');
module.exports = function(passport){

passport.use('local-signin',new LocalStrategy(
  function(username, password, done) {
  
    User.getUserByUsername(username,function(err,user){
      if(err) throw err;
      if(!user){
        return done(null, false);
      }
    
      User.compareByPassword(password,user.password,function(err,isMatch){
        if(err) throw err;
        if(isMatch){
          return done(null,user);
        }else{
          return done(null,false);
        }
      });
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


}

