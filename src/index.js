"use strict";

var shellParser = require('./shell-parser');

module.exports = function (robot) {
  robot.receiveMiddleware(function (context, next, done) {
    var message = context.response.message;

    if (message.constructor.name === 'TextMessage') {
      var expr = shellParser.parse(message.text);
      console.log(expr.dump());
    } else {
      next(done);
    }
  });
};
