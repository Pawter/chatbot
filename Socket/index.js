"use strict";

var socket = require('socket.io-client')('http://www.suptv.org:2052');

module.exports = socket;
