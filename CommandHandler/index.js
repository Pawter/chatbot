"use strict";

var path = require("path").join(__dirname);

require("fs").readdirSync(__dirname).forEach(function(file) {
  /* If its the current file ignore it */
  if (file === 'index.js') return;

  /* Store module with its name (from filename) */
  var tmpRequire = require(__dirname+'/'+file+'/index');
  module.exports[file] = {
    Command: tmpRequire.Command,
    Level: (tmpRequire.hasOwnProperty('Level') ? tmpRequire.Level : 1 ),
    AllowGuest: tmpRequire.AllowGuest || false
  };
  console.log('[Command] Loaded command: ' + file);
});
