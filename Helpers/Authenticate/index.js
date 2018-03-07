"use strict";

// Required Libs
let request = require('request');
const socket = require('../../Socket');

// Config
const config = require('../../Config/login'),
      configRoom = require('../../Config/room'),
      configOwner = require('../../Config/owner');

// Cookie jar
let j = request.jar();
request = request.defaults({jar:j});

// Token
let token = false,
    tokenTime = Math.round(new Date().getTime()/1000),
    tokenSent = false,
    authenticated = false;

// Get guest token
request('http://www.suptv.org/chat/' + configRoom, function(err, res, body)
{
  console.log('[Login] Got guest token.');
  token = new RegExp('src="http:\/\/www.suptv.org\/js\/chat\/client.js" token="(.*)"', "g").exec(body)[1];
  socket.emit('authenticate', token, tokenTime);
  console.log('[Login] Sent guest token.');
  if(!tokenSent)
  {
    socket.emit('modal', {action: 'Login', username: config.username, password: config.password});
    console.log('[Login] Sent login.');
  }
  tokenSent = true;
});

// Login
socket.on('modal-response-Login', function(data)
{
  if(!data.token)
  {
    console.log('[Login] FAILED to login, disconnecting.');
    socket.disconnect();
    return;
  }
  request('http://www.suptv.org/chat/' + configRoom + '?token='+data.token, function(err, res, body)
  {
    token = new RegExp('src="http:\/\/www.suptv.org\/js\/chat\/client.js" token="(.*)"', "g").exec(body)[1];
    socket.disconnect();
    socket.connect();
    socket.emit('authenticate', token, tokenTime);
    console.log('[Login] Successfully logged in.');
    setTimeout(function(){
      authenticated = true;
    }, 2000);
  });
});

/* ==================================
Authenticate
===================================== */
socket.on('server-Authenticated', function(config)
{
  if(authenticated)
  {
    console.log('Server-Authenticated: ' + config.username);
    socket.emit('message-post', `/w ${configOwner} Bot has initiated with success.`);
  }
});

function CheckAuth(callback)
{
  return callback(authenticated);
}

/* ==================================
Exports
===================================== */
module.exports.authenticated = authenticated;
module.exports.CheckAuth     = CheckAuth;
