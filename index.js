"use strict";

const shell = require('shelljs');

// Required
const socket = require('./Socket');

// Helpers
const Authenticate = require('./Helpers/Authenticate');

// Config
const configPrefix = require('./Config/prefix');

// Commands
const CommandHandler = require('./CommandHandler');

/* ==================================
Disconnected
===================================== */
socket.on('disconnect',function()
{
  Authenticate.CheckAuth(function(data)
  {
    if(data)
    {
      console.log("[Status] Disconnected from server.");
      shell.exec('node index.js');
    }
  });
});

/* ======================================
DING - DONG
======================================= */
socket.on("DING", function()
{
  socket.emit("DONG");
});

/* ======================================
Listen for incoming MESSAGES
======================================= */
socket.on('message-get', function(info, css, message)
{
  // Split message
  let messageArray = message.split(' ');

  // Does message start with command prefix?
  if(message.charAt(0) == configPrefix)
  {
    messageArray[0] = messageArray[0].toLowerCase();

    // Does command exist?
    if(CommandHandler.hasOwnProperty(messageArray[0].substring(1)))
    {
      let tmpCmd = CommandHandler[messageArray[0].substring(1)];

      // Does command meet user's level?
      if(tmpCmd.Level >= info.level)
      {
        tmpCmd.Command(info, css, messageArray.slice(1));
      }
    }
  }
  console.log('[message] ' + info.username + ': ' + message );
});

/* ======================================
Listen for incoming WHISPERS
======================================= */
socket.on('Whisper-receiver', function(info, css, message)
{
  console.log('[whisper] ' + info.username + ': ' + message);
});
