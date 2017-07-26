var express = require('express');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var cookieParser = require('cookie-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');
var path = require('path');
var flash = require('connect-flash');
var morgan = require('morgan');
var fs = require('fs');
var mongoose = require('mongoose');
var app = express();


//set view engine
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
//use body parser and express validator


mongoose.connect('mongodb://localhost/myappdb');
var db = mongoose.connection;

require('./config/passport')(passport);
app.use(cookieParser('sdfsdfsgg'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
//app.use(morgan());


var options = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'myappdb'
};

var sessionStore = new MySQLStore(options);

app.use(session({
    secret: 'sdfsdfsgg',
    store: sessionStore,
    resave: false,
    saveUninitialized: false
    // cookie: { secure: true }
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));


app.use(function (req, res, next) {

    if (req.isAuthenticated()) {
        console.log(req.session.passport.user);
        console.log(req.user.name);
        res.locals.user = req.user.user_id;
    } else {

    }
    next();
});


//set routes

require('./routes/index')(app,passport);


app.listen(8000, function (err) {

    if (err) {
        console.log(err);
    } else {
        console.log("Server started on port 8000");
    }

});




//register partials

var hbs = require('hbs');
hbs.registerPartials(__dirname + '/views/partials');




