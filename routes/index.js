var expressValidator = require('express-validator');
//require bcrypt to hash password
var bcrypt = require('bcrypt');
var User = require('../models/user');
const saltRounds = 10;

module.exports = function (app,passport) {


    app.get('/register', function (req, res) {
        res.render('register', { title: 'Registration' });
    });

    app.post('/register', function (req, res) {


     

        req.checkBody('username', 'Username field cannot be empty.').notEmpty();
        req.checkBody('username', 'Username must be between 4-15 characters long.').len(4, 15);
        req.checkBody('email', 'The email you entered is invalid, please try again.').isEmail();
        req.checkBody('email', 'Email address must be between 4-100 characters long, please try again.').len(4, 100);
        req.checkBody('password', 'Password must be between 8-100 characters long.').len(8, 100);
        req.checkBody("password", "Password must include one lowercase character, one uppercase character, a number, and a special character.").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, "i");
        req.checkBody('passwordMatch', 'Password must be between 8-100 characters long.').len(8, 100);
        req.checkBody('passwordMatch', 'Passwords do not match, please try again.').equals(req.body.password);


        const errors = req.validationErrors();
        if (errors) {
            console.log(`errors:${JSON.stringify(errors)}`);
            res.render('register', { title: 'Registrstion error', errors: errors });
        } else {
            const username = req.body.username;
            const email = req.body.email;
            const password = req.body.password;
            var newUser = new User({
                username:username,
                email:email,
                password:password
            }); 
            User.createUser(newUser,function(err,user){
                if(err) throw err;
                console.log(user);
            });
            res.redirect('/login')
        }
    });



    app.get('/', function (req, res) {
        res.render('home', { title: 'Home Page' });
        console.log(req.isAuthenticated());
    });



    app.get('/login', function (req, res) {
        res.render('login', { title: 'Login', message: req.flash('error') });
    });


    app.post('/login', passport.authenticate('local-signin', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    }));

    app.get('/logout', function (req, res) {
        req.logout();
        req.session.destroy(function () {
            res.clearCookie('connect.sid');
            res.redirect('/');
        });
    });




    require('dotenv').config();

    app.set("view options", { layout: false });

    app.engine('html', require('ejs').renderFile);

    app.get('/contact', function (req, res) {
        res.render('contact.html');
    });


    app.get('/profile', function (req, res) {
        if (req.isAuthenticated()) {
            res.render('profile');

        } else {
            res.redirect('/login');
        }
    });



}