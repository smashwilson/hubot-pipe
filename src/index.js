"use strict";

var shellParser = require('./shell-parser');
var Messenger = require('./messenger');
var Capture = require('./capture');

module.exports = function (robot) {
  robot.__hubot_pipe_patched = false;

  robot.receiveMiddleware(function (context, next, done) {
    var message = context.response.message;

    if (Messenger.isTextMessage(message) && ! context.response.robot.__hubot_pipe_patched) {
      var expr = shellParser.parse(message.text);
      var messenger = new Messenger(message);
      var capture = new Capture(context.response.robot);
      var patched = capture.patchedRobot(0);

      expr.evaluate(patched, messenger);

      capture.onComplete(function (err, results) {
        if (err) return;
        message.text = results.join("");

        next(done);
      });
    } else {
      next(done);
    }
  });
};
