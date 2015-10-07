// Abstract syntax tree for a parsed Hubot command.

// PipeSequence is an ordered collection of (one or more) actions, separated by pipes ("|").
export.PipeSequence = PipeSequence = function (seq) {
  this.seq = seq || [];
};

PipeSequence.prototype.prefixedWith = function (command) {
  this.seq.unshift(command);
  return this;
};

// Command is an ordered collection of (one or more) "parts", which can be CommandParts or inner
// PipeSequences.
export.Command = Command = function (parts) {
  this.parts = parts;
};

Command.assemble = function (before, inner, after) {
  if (after !== null) {
    return after.prefixedWith(inner).prefixedWith(before);
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

// CommandPart is a part of a command that will be used literally within its parent Command.
export.CommandPart = CommandPart = function (text) {
  this.text = text;
};