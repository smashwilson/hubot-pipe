"use strict";

var Capture = module.exports = function (robot) {
  this.robot = robot;
  this.captured = {};
  this.idsRemaining = [];
  this.completeCallback = function () {};
};

Capture.prototype.onComplete = function (callback) {
  this.completeCallback = callback;
};

Capture.prototype.patchedRobot = function (id) {
  var self = this;
  var patchedAdapter = Object.create(this.robot.adapter);

  this.idsRemaining.push(id);

  patchedAdapter.send = function () {
    var strings = Array.prototype.slice.call(arguments, 1);
    console.log("got: " + strings.join(", "));
    strings.forEach(function (arg) {
      self._capture(id, arg);
    });
  };

  var patchedRobot = Object.create(this.robot);
  patchedRobot.adapter = patchedAdapter;

  return patchedRobot;
};

Capture.prototype._capture = function (id, msg) {
  this.captured[id] = msg;

  var ind = this.idsRemaining.indexOf(id);
  if (ind === -1) {

  }

};

Capture.prototype._checkCompletion = function () {
  if (this.idsRemaining.length === 0) {
    this.completeCallback(this.captured);
  }
};
