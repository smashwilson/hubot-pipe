"use strict";

// Abstract syntax tree for a parsed Hubot command.

// Pipe is an ordered collection of (one or more) Commands, separated by pipes ("|").
var Pipe = exports.Pipe = function (seq) {
  this.seq = seq || [];
};

Pipe.prototype.prefixedWith = function (command) {
  this.seq.unshift(command);
  return this;
};

Pipe.prototype.dump = function () {
  return "(Pipe " +
    this.seq.map(function (p) { return p.dump(); }).join(" ") +
    ")";
};

// Command is an ordered collection of (one or more) "parts", which can be Parts or inner
// Pipes.
var Command = exports.Command = function (parts) {
  this.parts = parts;
};

Command.assemble = function (before, inner, after) {
  if (after !== null) {
    var cmd = after.prefixedWith(inner);
    if (before !== null) {
      cmd = cmd.prefixedWith(before);
    }
    return cmd;
  }

  var parts = [];
  if (before !== null) {
    parts.push(before);
  }
  parts.push(inner);
  return new Command(parts);
};

Command.prototype.prefixedWith = function (expr) {
  this.parts.unshift(expr);
  return this;
};

Command.prototype.dump = function () {
  return "(Command " +
    this.parts.map(function (p) { return p.dump(); }).join(" ") +
    ")";
};

// Part is a part of a command that will be used literally within its parent Command.
var Part = exports.Part = function (text) {
  this.text = text;
};

Part.prototype.dump = function () {
  return "(Part [" + this.text + "])";
};
