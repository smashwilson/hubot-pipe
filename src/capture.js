"use strict";

var Capture = module.exports = function (robot) {
  this.robot = robot;
  this.captured = [];
  this.completeCallback = null;
};

Capture.prototype.onComplete = function (callback) {
  this.completeCallback = callback;
  this._checkCompletion();
};

Capture.prototype.patchedRobot = function (id) {
  var self = this;
  var patchedAdapter = Object.create(this.robot.adapter);

  this.captured[id] = [];

  patchedAdapter.send = function () {
    var strings = Array.prototype.slice.call(arguments, 1);
    strings.forEach(function (arg) {
      self._capture(id, arg);
    });
  };

  var patchedRobot = Object.create(this.robot);
  patchedRobot.__hubot_pipe_patched = true;
  patchedRobot.adapter = patchedAdapter;

  // Patch out the robot reference in each registered Listener
  patchedRobot.listeners = this.robot.listeners.map(function (listener) {
    var patchedListener = Object.create(listener);
    patchedListener.robot = patchedRobot;
    return patchedListener;
  });

  return patchedRobot;
};

Capture.prototype._capture = function (id, msg) {
  this.captured[id].push(msg);
  this._checkCompletion();
};

Capture.prototype._isComplete = function () {
  if (this.completeCallback === null) {
    return false;
  }

  return ! this.captured.some(function (each) {
    return each.length === 0;
  });
}

Capture.prototype._checkCompletion = function () {
  while (this._isComplete()) {
    var result = [];

    // TODO: this should actually handle permutations, somehow
    this.captured.forEach(function (each, i) {
      result[i] = each.shift();
    }.bind(this));

    this.completeCallback(null, result);
  }
};
