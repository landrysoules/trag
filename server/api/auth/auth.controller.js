'use strict';
//Declare URL of your database
var nano = require('nano')('http://localhost:5984/trag');
var _ = require('lodash');
//We will use jsonwebtoken to actually generate the token
var jwt = require('jsonwebtoken');
var _ = require('lodash');

exports.authenticate = function(req, res) {
    //Client will call this method to query a token
    var username = req.body.username;
    var password = req.body.password;
    nano.get(username, null, function(err, body) {
        if (err) {
            res.send(401, 'Wrong user or password');
            return;
        } else {
            console.log(body);
			//properties contained in the token, of course you can add first name, last name and so on
            var profile = {
                username: username
            };
            // We are encoding the profile inside the token
            var token = jwt.sign(profile, req.app.get('secret'), {
                expiresInMinutes: 60 * 5
            });
            res.json({
                token: token
            });
        }
    });
};

exports.signup = function(req, res) {
//when signup method is called, we insert a new user in couchDB, username being the id of the record
    nano.insert({
        'password': req.body.password
    }, req.body.username, function(err, body, header) {
        if (err) {
			//if for example username already exists in database, an error will be thrown
            console.log('user insertion error', err.message);
            res.send(400, err.message);
        }else{
        console.log('you have inserted a new user: ' + req.body.username);
        console.log(req.body);
		           var profile = {
                username: req.body.username
            };
            // We are encoding the profile inside the token
            var token = jwt.sign(profile, req.app.get('secret'), {
                expiresInMinutes: 60 * 5
            });
            res.json({
                token: token
            });
        
		}
    });
};