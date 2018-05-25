var express = require('express');
var session = require('express-session');
var flash = require('connect-flash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var router = express.Router();
var User = require('../models/user')
var multer = require('multer');
var uploads = multer({dest:'./uploads'});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  req.flash('error_msg', 'please regiter using the form below');
  res.render('register', {'title': 'register'});
});

router.post('/register',uploads.single('profileimage'), function (req, res, next) {
	
		name = req.body.name;
		email = req.body.email;
		password = req.body.password;
		passwordc = req.body.passwordc;
		username = req.body.username;
		console.log(req.file);
		console.log("passed point A");

	

	//check for image field
	if(req.file){
		console.log("passed point B");
		console.log("hey successfully uploaded");
		var profileImageOriginalName = req.file.orginalname;
		var profileImageName = req.file.fieldname;
		var profileImageMime = req.file.mimetype;
		var profileImagePath = req.file.path;
		//var profileImagePath = req.file.extension;
		var profileImageSize = req.file.size;
	} else {
		var profileimageName = 'noimage.png';
	}

	// form validation
	req.checkBody('name', 'Name field is required').notEmpty();
	req.checkBody('email', 'Email field is required').notEmpty();
	req.checkBody('email', 'Enter a valid Email').isEmail();
	req.checkBody('username', 'username field is required').notEmpty();
	req.checkBody('password', 'Password field is required').notEmpty();
	req.checkBody('passwordc', 'Passwords do not match').equals(req.body.password);

	// check for erros
	//var errors = req.validatationErrors();

	var error = [];
	req.getValidationResult()
		.then(function(result){
			console.log(result.array());
			error = result.array();
			if(error.length > 0){
				console.log('still inside the error please get out of the error');
				res.render('register', {
				error : error,
				name : name,
				email : email,
				username : username
				});

			}else{

				console.log('ha ha inside the usercreation');
				var newUser = new User({
				name: name,
				email: email,
				password: password,
				username: username,
				profileimage: profileimageName
				});

				User.createUser(newUser, function(err , user){
				if(err) throw err;
				console.log("user created");
				});

				//success Message
				req.flash('success', 'you are now registered and may login');
				res.location('/users/members');
				res.redirect('/users/members');
				}

		});

        console.log('getting the erros');
		console.log(error);

	




});

 

// passport.serializeUser(function(user,done){
// 	done(null,user.id);
// });

// passport.deserializeUser(function(){
// 	User.getUserById(id,function(err,user){
// 		done(err,user);
// 	});
// });

// passport.use(new LocalStrategy(
// 		function(username, password, done){
// 			console.log('inside the fucking local stretagy');
// 				User.getUserByUsername(username, function(err, user){
// 						if(err) throw err;
// 						if(!user){
// 							console.log('Unknown user');
// 							return done(null,false,{message:'Unknown User'});
// 						}

// 						User.comparePassword(password,user.password,function(err,isMatch){
// 							if(err) throw err;
// 							if(isMatch){
// 								return done(null,user);
// 							}else{
// 								console.log('Invalid Password');
// 								return done(null,false, {message: 'Invalid password'});
// 							}
// 						})
// 				})
// 		}
// 	));


passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
        User.getUserById(id, function(err, user) {
            done(err, user);
        });
	});
	

passport.use( new LocalStrategy(
	function(username, password, done) {
    User.getUserByUsername(username, function(err, user){
        if(err) throw err;
        if(!user){
			console.log('unknown User');
            return done(null, false, {message: 'Unknown User'});
        }
        User.comparePassword(password, user.password, function(err, isMatch){
            if(err) throw err;
            if(isMatch){
                return done(null, user);
            } else {
				console.log('invalid password');
                return done(null, false, {message: 'Invalid password'});
            }
        });
    });
}));

router.post('/login',
    passport.authenticate('local', { failureRedirect:'/users/login',failureFlash: 'invalid username or password'}),
    function(req, res) {
		req.flash('error_msg', 'you are logged in');
        res.redirect('/users/members');
    });
// passport.deserializeUser(function (id, done) {
// 	User.getUserById(id, function (err, user) {
// 		done(err, user);
// 	});
// });


// passport.use( new LocalStrategy({
// 	session:false,
// 	passReqToCallback: true
// },
// 	function ( req ,username, password, done) {
// 		User.getUserByUsername(username, function (err, user) {
// 			if (err) throw err;
// 			if (!user) {
// 				return done(null, false, { message: 'Unknown User' });
// 			}

// 			User.comparePassword(password, user.password, function (err, isMatch) {
// 				if (err) throw err;
// 				if (isMatch) {
// 					return done(null, user);
// 				} else {
// 					return done(null, false, { message: 'Invalid password' });
// 				}
// 			});
// 		});

			
// 	}));



// router.post('/login', passport.authenticate('local', {
// 	failureRedirect:'/users/login', 
// 	failureFlash:'Invalid username or Password'
// 	}),function(req,res){
// 	console.log('Authentication Successful');
// 	req.flash('sucess', 'you are logged in');
// 	res.redirect('/');
// });

// router.post('/login', passport.authenticate('local-login', {
//             successRedirect : '/users/members', // redirect to the secure profile section
//             failureRedirect : '/users/login', // redirect back to the signup page if there is an error
//             failureFlash : true // allow flash messages
//         }));

// router.post('/login',
// 	passport.authenticate('local', { 
// 		//successRedirect: '/users/members', 
// 		failureRedirect: '/users/login', 
// 		failureFlash: true }),
// 	function (req, res) {
// 		res.redirect('/users/members');
// 	});

router.get('/login', function(req, res, next) {
  res.render('login', {'title': 'login'});
});

router.get('/members', function(req, res, next) {
  res.render('members', {'title': 'members'});
});


module.exports = router;
