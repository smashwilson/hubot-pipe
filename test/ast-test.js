"use babel";

var expect = require('chai').expect;

var ast = require('../src/ast');
var Pipe = ast.Pipe;
var Command = ast.Command;
var Part = ast.Part;

var Messenger = require('../src/messenger');

function MockRobot () {
  var self = this;

  this.sent = [];
  this.adapter = {
    send: function (envelope, string) {
      self.sent.push(string);
    }
  };

  this.listeners = [];
};

MockRobot.prototype.receive = function (message) {
  this.adapter.send("the-envelope", "received {" + message.text + "}");
};

function makeMessenger() {
  return new Messenger({
    room: "a-room",
    user: "a-user",
    text: "original"
  });
};

describe("Part", function () {

  it("sends itself as-is", function () {
    var r = new MockRobot();
    var m = makeMessenger();

    var p = new Part("text");

    p.evaluate(r, m);
    expect(r.sent).to.deep.equal(["text"]);
  });

});

describe("Command", function () {

  it("evaluates its parts, collects them, then sends to its robot", function () {
    var robot = new MockRobot();
    var messenger = makeMessenger();

    var c = new Command([
      new Part("one "),
      new Part("two "),
      new Part("three")
    ]);

    c.evaluate(robot, messenger);

    expect(robot.sent).to.deep.equal(["received {one two three}"]);
  });

});

describe("Pipe", function () {

  it("evaluates its commands from left to right, appending output to the next's input", function () {
    var robot = new MockRobot();
    var messenger = makeMessenger();

    var p = new Pipe([
      new Command([new Part("a0 "), new Part("a1")]),
      new Command([new Part("b0 "), new Part("b1 ")]),
      new Command([new Part("c0 "), new Part("c1 ")])
    ]);

    p.evaluate(robot, messenger);

    expect(robot.sent).to.deep.equal(["received {c0 c1 received {b0 b1 received {a0 a1}}}"]);
  });

});
