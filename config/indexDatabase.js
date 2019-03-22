'use strict';

var env = process.env.NODE_ENV || 'developpement';
var config = require(`./database/${env}`);


module.exports = config;
