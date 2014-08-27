'use strict';

var express = require('express');
var controller = require('./auth.controller');

var router = express.Router();

router.post('/', controller.authenticate);
router.post('/signup', controller.signup);

module.exports = router;