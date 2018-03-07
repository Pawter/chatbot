"use strict";

// Required
var socket = require('../../Socket');
var request = require('request');

/* ==================================
Function
===================================== */
function Command(user, css, message)
{
  request.get({url: 'https://yesno.wtf/api', json: true}, function(error, response, body)
  {
    console.log(body);
    socket.emit('message-post', body.answer + " " + body.image);
  });

}

/* ==================================
Export
===================================== */
module.exports.Command = Command;
module.exports.Level = 0;
