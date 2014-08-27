/**
 * Express configuration
 */

'use strict';

var express = require('express');
var favicon = require('static-favicon');
var morgan = require('morgan');
var compression = require('compression');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var errorHandler = require('errorhandler');
var path = require('path');
var config = require('./environment');
//declare express-jwt plugin
var expressJwt = require('express-jwt');
//specify the salt passphrase JWT will use for its token encryption
var SECRET = 'mysecret';

module.exports = function (app) {
	var env = app.get('env');

	app.set('views', config.root + '/server/views');
	//Make your passphrase accessible from app object
	app.set('secret', SECRET);
	app.engine('html', require('ejs').renderFile);
	app.set('view engine', 'html');
	app.use(compression());
	app.use(bodyParser.urlencoded({
			extended : false
		}));
	app.use(bodyParser.json());
	app.use(methodOverride());
	app.use(cookieParser());
/*
	app.post('/authenticate', function (req, res) {
		//TODO validate req.body.username and req.body.password
		//if is invalid, return 401
		if (!(req.body.username === 'john.doe' && req.body.password === 'foobar')) {
			res.send(401, 'Wrong user or password');
			return;
		}

		var profile = {
			first_name : 'John',
			last_name : 'Doe',
			email : 'john@doe.com',
			id : 123
		};

		// We are sending the profile inside the token
		var token = jwt.sign(profile, SECRET, {
				expiresInMinutes : 60 * 5
			});

		res.json({
			token : token
		});
	});
*/
//specify the path where will reside all your JWT secured apis, and tell it which passphrase encryption to use  
//Thanks to unless, you can also specify exception: routes that will not be restricted
	app.use('/api', expressJwt({
			secret : SECRET
		}).unless({path: ['/api/auth','/api/things','/api/auth/signup']}));

	if ('production' === env) {
		app.use(favicon(path.join(config.root, 'public', 'favicon.ico')));
		app.use(express.static(path.join(config.root, 'public')));
		app.set('appPath', config.root + '/public');
		app.use(morgan('dev'));
	}

	if ('development' === env || 'test' === env) {
		app.use(require('connect-livereload')());
		app.use(express.static(path.join(config.root, '.tmp')));
		app.use(express.static(path.join(config.root, 'client')));
		app.set('appPath', 'client');
		app.use(morgan('dev'));
		app.use(errorHandler()); // Error handler - has to be last
	}
};
