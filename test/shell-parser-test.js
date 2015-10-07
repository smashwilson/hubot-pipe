var expect = require('chai').expect;

var shellParser = require('../src/shell-parser');
var ast = require('../src/ast');

describe("shell-parser", function () {

  it("passes commands with no special shell concepts as-is", function () {
    var expr = shellParser.parse("@hubot pug me");
    
    expect(expr.dump()).to.equal("(PipeSequence (Command (CommandPart [@hubot pug me])))");
  });

  it("identifies subshell invocations");

  it("identifies a pipe sequence");

  it("parses a pipe within a subshell");
  
  it("parses a subshell within a pipe");

});