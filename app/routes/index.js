'use strict';

var path = process.cwd();
var pollController = require(path + '/app/controllers/pollController.client.js');

module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			return pollController.index(req, res);
		}
	}

	app.route('/')
		.get(function (req, res) {
		    pollController.index(req, res);
		});
		
    app.route('/signup')
      .get(function(req, res) {
      	res.render(path + '/public/signup.ejs', { message: req.flash('signupMessage') });
      })
      .post(passport.authenticate('local-signup', 
              { successRedirect: '/',
                failureRedirect: '/signup',
                failureFlash: true
              }));
		
   app.route('/login')
      .get(function(req, res) {
      	res.render(path + '/public/login.ejs', { message: req.flash('loginMessage') });
      })
      .post(passport.authenticate('local-login', 
              { successRedirect: '/',
                failureRedirect: '/login',
                failureFlash : true // allow flash messages
              }));

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/');
		});

	app.route('/mypolls')
		.get(isLoggedIn, function (req, res) {
			pollController.userPolls(req, res);
		});

	app.route('/api/:id')
		.get(isLoggedIn, function (req, res) {
			res.json(req.user.github);
		});
		
    app.route('/newpoll')
		.get(isLoggedIn, function (req, res) {
			res.render(path + '/public/newpoll.ejs', {
				user: req.user._id.toString()
			});
		})
		.post(isLoggedIn, function(req, res) {
			pollController.create(req, res);
		});
	
	app.route('/polls')
	   .get(function(req, res) {
	       pollController.index(req, res);
	   });
	   
	app.route('/polls/:id')
	   .get(function(req, res) {
	   	   pollController.show(req, res);
	   })
	   .post(function(req, res) {
	   	   pollController.vote(req, res);
	  });
	  
    app.route('/delete/:id')
       .post(isLoggedIn, function(req, res) {
       	   pollController.destroy(req, res);
       })
};
