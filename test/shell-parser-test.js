var expect = require('chai').expect;

var shellParser = require('../src/shell-parser');
var ast = require('../src/ast');

describe("shellParser", function () {

  var parsesAs = function (original, expected) {
    var expr = shellParser.parse(original);
    expect(expr.dump()).to.equal(expected);
  };

  describe("plain commands", function () {

    it("passes commands with no special shell concepts as-is", function () {
      parsesAs("@hubot pug me", "(PipeSequence (Command (CommandPart [@hubot pug me])))");
    });

    it("accepts ( in a normal command");

    it("accepts $ in a normal command");

    it("accepts ) in a normal command");

  });

  describe("subshells", function () {

    it("identifies subshell invocations", function () {
      var input = "@hubot echo $(@hubot pug me) is a pug image";

      var expected = "(PipeSequence (Command " +
        "(CommandPart [@hubot echo ]) " +
        "(PipeSequence (Command (CommandPart [@hubot pug me]))) " +
        "(CommandPart [ is a pug image])))";
      parsesAs(input, expected);
    });

    it("identifies multiple subshells", function () {
      var input = "hubot echo $(hubot echo one) and $(hubot echo two)";

      var expected = "(PipeSequence (Command " +
        "(CommandPart [hubot echo ]) " +
        "(PipeSequence (Command (CommandPart [hubot echo one]))) " +
        "(CommandPart [ and ]) " +
        "(PipeSequence (Command (CommandPart [hubot echo two])))" +
        "))";

      parsesAs(input, expected);
    });

    it("parses nested subshells", function () {
      var input = "hubot echo 1 $(hubot echo 2 $(hubot echo 3 foo))";

      var expected = "(PipeSequence (Command " +
        "(CommandPart [hubot echo 1 ]) " +
        "(PipeSequence (Command " +
          "(CommandPart [hubot echo 2 ]) " +
          "(PipeSequence (Command " +
            "(CommandPart [hubot echo 3 foo])" +
            "))" +
          "))" +
        "))";
      parsesAs(input, expected);
    });

  });

  it("identifies a pipe sequence");

  it("parses a pipe within a subshell");

  it("parses a subshell within a pipe");

});
