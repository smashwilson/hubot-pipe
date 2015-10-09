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
