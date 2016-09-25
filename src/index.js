"use strict";

var shellParser = require('./shell-parser');
var Messenger = require('./messenger');
var Capture = require('./capture');

module.exports = function (robot) {
  robot.__hubot_pipe_patched = false;

  robot.receiveMiddleware(function (context, next, done) {
    var message = context.response.message;

    if (Messenger.isTextMessage(message) && ! context.response.robot.__hubot_pipe_patched) {
      try {
        var expr = shellParser.parse(message.text);
        var messenger = new Messenger(message);
        var capture = new Capture(context.response.robot);
        var patched = capture.patchedRobot(0);

        expr.evaluate(patched, messenger);

        capture.onComplete(function (err, results) {
          if (err) {
            console.error(err);
            return;
          };

          var accumulated = [];
          for (var i = 0; i < results.length; i++) {
            var result = results[i];

            if (typeof result === 'string') {
              accumulated.push(result);
            } else {
              if (accumulated.length > 0) {
                context.response.send(accumulated.join(""));
                accumulated = [];
              }

              context.response.send(result);
            }
          }

          if (accumulated.length > 0) {
            context.response.send(accumulated.join(""));
          }
        });
      } catch (e) {
        if (e.name === 'SyntaxError') {
          next(done);
        } else {
          throw e;
        }
      }
    } else {
      next(done);
    }
  });
};
