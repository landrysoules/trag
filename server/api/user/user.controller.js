'use strict';

var jwt = require('jsonwebtoken');
var nano = require('nano')('http://localhost:5984/trag');
var _ = require('lodash');

exports.profile = function (req, res) {

	var token = null;
	var parts = req.headers.authorization.split(' ');
	if (parts.length == 2) {
		var scheme = parts[0];
		var credentials = parts[1];

		if (/^Bearer$/i.test(scheme)) {
			token = credentials;
			var decoded = jwt.decode(token, req.app.secret);
			console.log(req.headers.authorization);
			var username = decoded.username;
			console.log("username to retrieve: " + username);
			nano.get(username, null, function (err, body) {
				if (err) {
					res.send(400, err);
					return;
				} else {
					console.log(body);
					res.json({
						profile : body
					});
				}
			});
		}
	} else {
		return next(new UnauthorizedError('credentials_bad_format', {
				message : 'Format is Authorization: Bearer [token]'
			}));
	}

};
