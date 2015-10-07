var expect = require('chai').expect;

var shellParser = require('../src/shell-parser');
var ast = require('../src/ast');

describe("shell-parser", function () {

  it("passes commands with no special shell concepts as-is", function () {
    var expr = shellParser.parse("@hubot pug me");

    expect(expr.dump()).to.equal("(PipeSequence (Command (CommandPart [@hubot pug me])))");
  });

  describe("subshells", function () {

    it("identifies subshell invocations", function () {
      var expr = shellParser.parse("@hubot echo $(@hubot pug me) is a pug image");

      var expected = "(PipeSequence (Command " +
        "(CommandPart [@hubot echo ]) " +
        "(PipeSequence (Command (CommandPart [@hubot pug me]))) " +
        "(CommandPart [ is a pug image])))";
      expect(expr.dump()).to.equal(expected);
    });

    it("identifies multiple subshells", function () {
      var expr = shellParser.parse("hubot echo $(hubot echo one) and $(hubot echo two)");

      var expected = "(PipeSequence (Command " +
        "(CommandPart [hubot echo ]) " +
        "(PipeSequence (Command (CommandPart [hubot echo one]))) " +
        "(CommandPart [ and ]) " +
        "(PipeSequence (Command (CommandPart [hubot echo two])))" +
        "))";
      expect(expr.dump()).to.equal(expected);
    });

    it("parses nested subshells", function () {
      var expr = shellParser.parse("hubot echo 1 $(hubot echo 2 $(hubot echo 3 foo))");

      var expected = "(PipeSequence (Command " +
        "(CommandPart [hubot echo 1 ]) " +
        "(PipeSequence (Command " +
          "(CommandPart [hubot echo 2 ]) " +
          "(PipeSequence (Command " +
            "(CommandPart [hubot echo 3 foo])" +
            "))" +
          "))" +
        "))";
      expect(expr.dump()).to.equal(expected);
    });

  });

  it("identifies a pipe sequence");

  it("parses a pipe within a subshell");

  it("parses a subshell within a pipe");

});
