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
      parsesAs("@hubot pug me", "(Pipe (Command (CommandPart [@hubot pug me])))");
    });

    it("accepts ( in a normal command", function () {
      var expected = "(Pipe (Command (CommandPart [hubot echo this ( should work])))";
      parsesAs("hubot echo this ( should work", expected)
    });

    it("accepts $ in a normal command", function () {
      var expected = "(Pipe (Command (CommandPart [hubot echo this $ should work])))";
      parsesAs("hubot echo this $ should work", expected)
    });

  });

  describe("subshells", function () {

    it("identifies subshell invocations", function () {
      var input = "@hubot echo $(@hubot pug me) is a pug image";

      var expected = "(Pipe (Command " +
        "(CommandPart [@hubot echo ]) " +
        "(Pipe (Command (CommandPart [@hubot pug me]))) " +
        "(CommandPart [ is a pug image])))";
      parsesAs(input, expected);
    });

    it("identifies multiple subshells", function () {
      var input = "hubot echo $(hubot echo one) and $(hubot echo two)";

      var expected = "(Pipe (Command " +
        "(CommandPart [hubot echo ]) " +
        "(Pipe (Command (CommandPart [hubot echo one]))) " +
        "(CommandPart [ and ]) " +
        "(Pipe (Command (CommandPart [hubot echo two])))" +
        "))";

      parsesAs(input, expected);
    });

    it("parses nested subshells", function () {
      var input = "hubot echo 1 $(hubot echo 2 $(hubot echo 3 foo))";

      var expected = "(Pipe (Command " +
        "(CommandPart [hubot echo 1 ]) " +
        "(Pipe (Command " +
          "(CommandPart [hubot echo 2 ]) " +
          "(Pipe (Command " +
            "(CommandPart [hubot echo 3 foo])" +
            "))" +
          "))" +
        "))";
      parsesAs(input, expected);
    });

    it("parses subshells at the command start", function () {
      var input = "$(hubot echo hubot echo) yep";

      var expected = "(Pipe (Command " +
          "(Pipe (Command (CommandPart [hubot echo hubot echo]))) " +
          "(CommandPart [ yep])" +
        "))";
      parsesAs(input, expected);
    });

    it("parses subshells at the command end", function () {
      var input = "hubot echo $(hubot echo yes)";

      var expected = "(Pipe (Command " +
          "(CommandPart [hubot echo ]) " +
          "(Pipe (Command (CommandPart [hubot echo yes])))" +
        "))";
      parsesAs(input, expected);
    });

  });

  describe("pipes", function () {

    it("identifies a pipe sequence", function () {
      var input = "hubot echo end | hubot echo middle | hubot echo beginning";

      var expected = "(Pipe " +
          "(Command (CommandPart [hubot echo end ])) " +
          "(Command (CommandPart [hubot echo middle ])) " +
          "(Command (CommandPart [hubot echo beginning]))" +
        ")";
      parsesAs(input, expected);
    });

  });

  describe("all together now", function () {

    it("parses a pipe within a subshell", function () {
      var input = "hubot echo $(hubot echo end | hubot echo beginning)";

      var expected = "(Pipe (Command " +
          "(CommandPart [hubot echo ]) " +
          "(Pipe " +
            "(Command (CommandPart [hubot echo end ])) " +
            "(Command (CommandPart [hubot echo beginning]))" +
          ")" +
        "))";
      parsesAs(input, expected);
    });

    it("parses a subshell within a pipe", function () {
      var input = "hubot echo $(hubot echo part one) | $(hubot echo hubot) echo part two";

      var expected = "(Pipe " +
          "(Command " +
            "(CommandPart [hubot echo ]) " +
            "(Pipe (Command (CommandPart [hubot echo part one]))) " +
            "(CommandPart [ ])" +
          ") " +
          "(Command " +
            "(Pipe (Command (CommandPart [hubot echo hubot]))) " +
            "(CommandPart [ echo part two])" +
          ")" +
        ")";
      parsesAs(input, expected);
    });

  });

});
