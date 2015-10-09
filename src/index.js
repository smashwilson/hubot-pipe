"use strict";

var shellParser = require('./shell-parser');
var messenger = require('./messenger');

module.exports = function (robot) {
  robot.receiveMiddleware(function (context, next, done) {
    var message = context.response.message;

    if (messenger.isTextMessage(message)) {
      var expr = shellParser.parse(msg.text);
      console.log(expr.dump());
    } else {
      next(done);
    }
  });
};
