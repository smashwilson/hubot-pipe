"use strict";

var expect = require('chai').expect;
var Capture = require('../src/capture');

describe("capture", function () {

  var robot = {
    adapter: {
      send: function () { return "original"; }
    }
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
    expect(capture.captured[0]).to.deep.equal(["something"]);
  });

  it("invokes its completion callback once all results are in", function () {
    var patched0 = capture.patchedRobot(0);
    var patched1 = capture.patchedRobot(1);

    var parts = null;
    capture.onComplete(function (p) {
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

});
