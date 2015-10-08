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
    var patched = capture.patchedRobot('the-id');

    var result = patched.adapter.send({}, "something");
    expect(capture.captured['the-id']).to.equal("something");
  });

  it("invokes its completion callback once all results are in", function () {
    var patched0 = capture.patchedRobot('id0');
    var patched1 = capture.patchedRobot('id1');

    var parts = null;
    capture.onComplete(function (p) {
      parts = p;
    });

    expect(parts).to.be.null;

    patched0.send("first part came in");
    expect(parts).to.be.null;

    patched1.send("second part came in");
    expect(parts).to.equal({
      id0: "first part came in",
      id1: "second part came in"
    });
  });

});
