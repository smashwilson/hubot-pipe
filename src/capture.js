"use strict";

function PipeOutput (msg) {
  this.queue = [msg];
};

PipeOutput.prototype.isEmpty = function () {
  return this.queue.length === 0;
};

PipeOutput.prototype.push = function (envelope, msg) {
  if (envelope.part) {
    throw new Error("Attempt to push Part output onto a PipeOutput");
  }

  this.queue.push(msg);

  return this;
};

PipeOutput.prototype.next = function () {
  return this.queue.shift();
};

PipeOutput.prototype.shouldContinue = function () {
  return true;
};

function PartOutput (msg) {
  this.text = msg;
};

PartOutput.prototype.isEmpty = function () {
  return false;
};

PartOutput.prototype.push = function () {
  throw new Error("Attempt to push additional output on top of a Part: " + this.text);
};

PartOutput.prototype.next = function () {
  return this.text;
};

PartOutput.prototype.shouldContinue = function () {
  return false;
};

function EmptyOutput () {};

EmptyOutput.prototype.isEmpty = function () {
  return true;
};

EmptyOutput.prototype.push = function (envelope, msg) {
  if (envelope.part) {
    return new PartOutput(msg);
  } else {
    return new PipeOutput(msg);
  }
};

EmptyOutput.prototype.next = function () {
  throw new Error("Attempt to read output from an EmptyOutput");
}

EmptyOutput.prototype.shouldContinue = function () {
  return false;
};

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

  this.captured[id] = new EmptyOutput();

  patchedAdapter.send = function (envelope) {
    var strings = Array.prototype.slice.call(arguments, 1);
    strings.forEach(function (arg) {
      self._capture(id, envelope, arg);
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

Capture.prototype._capture = function (id, envelope, msg) {
  this.captured[id] = this.captured[id].push(envelope, msg);
  this._checkCompletion();
};

Capture.prototype._isComplete = function () {
  if (this.completeCallback === null) {
    return false;
  }

  return ! this.captured.some(function (each) {
    return each.isEmpty();
  });
}

Capture.prototype._checkCompletion = function () {
  while (this._isComplete()) {
    var result = [];

    // TODO: this should actually handle permutations, somehow
    this.captured.forEach(function (each, i) {
      result[i] = each.next();
    }.bind(this));

    this.completeCallback(null, result);

    // Terminate early if *all* components are Parts, and would otherwise continue producing output
    // infinitely.
    if (! this.captured.some(function (each) { return each.shouldContinue(); })) {
      return ;
    }
  }
};
