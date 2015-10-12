"use strict";

var expect = require('chai').expect;
var Capture = require('../src/capture');

describe("capture", function () {

  var robot = {
    adapter: {
      send: function () { return "original"; }
    },
    listeners: []
  };

  var capture;

  beforeEach(function () {
    capture = new Capture(robot);
  });

  it("patches #send in the robot's adapter", function () {
    // Prevent the capture from being "complete"
    capture.patchedRobot(1);

    var patched = capture.patchedRobot(0);

    var result = patched.adapter.send({}, "something");
    expect(capture.captured[0].isEmpty()).to.be.false;
    expect(capture.captured[0].next()).to.equal("something");
  });

  it("invokes its completion callback once all results are in", function () {
    var patched0 = capture.patchedRobot(0);
    var patched1 = capture.patchedRobot(1);

    var parts = null;
    capture.onComplete(function (err, p) {
      parts = p;
    });

    expect(parts).to.be.null;

    patched0.adapter.send({}, "first part came in");
    expect(parts).to.be.null;

    patched1.adapter.send({}, "second part came in");
    expect(parts).to.deep.equal([
      "first part came in",
      "second part came in"
    ]);
  });

  it("invokes the completion callback if results are already there", function () {
    capture.patchedRobot(0).adapter.send({}, "one");
    capture.patchedRobot(1).adapter.send({}, "two");

    var parts = null;
    capture.onComplete(function (err, p) {
      parts = p;
    });

    expect(parts).to.deep.equal(["one", "two"]);
  });

  it("reinvokes the callback when new results arrive", function () {
    var patched0 = capture.patchedRobot(0);
    var patched1 = capture.patchedRobot(1);

    var parts = null;
    capture.onComplete(function (err, p) {
      parts = p;
    });

    patched0.adapter.send({}, "aaa");
    expect(parts).to.be.null;
    patched1.adapter.send({}, "bbb");
    expect(parts).to.deep.equal(["aaa", "bbb"]);
    parts = null;

    patched0.adapter.send({}, "ccc");
    expect(parts).to.be.null;
    patched1.adapter.send({}, "ddd");
    expect(parts).to.deep.equal(["ccc", "ddd"]);
  });

  it("reuses output from static results over and over again", function () {
    var patched0 = capture.patchedRobot(0);
    var patched1 = capture.patchedRobot(1);

    var parts = null;
    capture.onComplete(function (err, p) {
      parts = p;
    });

    patched0.adapter.send({static: true}, "aaa");
    expect(parts).to.be.null;
    patched1.adapter.send({}, "bbb");
    expect(parts).to.deep.equal(["aaa", "bbb"]);
    parts = null;

    patched1.adapter.send({}, "ccc");
    expect(parts).to.deep.equal(["aaa", "ccc"]);
    parts = null;

    patched1.adapter.send({}, "ddd");
    expect(parts).to.deep.equal(["aaa", "ddd"]);
  });

});
