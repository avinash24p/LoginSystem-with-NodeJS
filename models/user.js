var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var UserSchema = mongoose.Schema({
    username:String,
    email:String,
    password:String
});

var User = module.exports = mongoose.model('User',UserSchema);


module.exports.createUser=function(newUser,callback){
    bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
        newUser.password=hash;
        newUser.save(callback);
    });
});
}

module.exports.getUserByUsername=function(username,callback){
   var query={username:username};
   User.findOne(query,callback);
}

module.exports.compareByPassword=function(candidatePassword, hash, callback){
   bcrypt.compare(candidatePassword,hash,function(err,isMatch){
       if(err) throw err;
       callback(null,isMatch);
   });
}