'use strict';

var https = require("https");
var express = require('express');
var routes = require('./app/routes/index.js');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var flash    = require('connect-flash');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var favicon = require('serve-favicon');

var app = express();
require('dotenv').load();
require('./app/config/passport')(passport);


app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

// set the view engine to ejs
app.set('view engine', 'ejs');

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/clementinejs");

app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/common', express.static(process.cwd() + '/app/common'));

app.use(favicon(__dirname + '/public/images/favicon.ico'));

app.use(session({ secret: process.env.SUPER_SECRET }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash()); // use connect-flash for flash messages stored in session

routes(app, passport);

var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});

setInterval(function() {
    https.get("https://still-oasis-41820.herokuapp.com/");
}, 300000); // ping site every 5 minutes to keep heroku from sleeping