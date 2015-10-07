{
  var ast = require('./ast');

  var PipeSequence = ast.PipeSequence;
  var Command = ast.Command;
  var CommandPart = ast.CommandPart;
}

expression
 = only:pipeSequence { return only; }

pipeSequence
 = left:command "|" [ \t]* right:pipeSequence {
   return right.prefixedWith(left);
 }
 / only:command {
   return new PipeSequence([only]);
 }

command
 = before:commandPart? "$(" inner:expression ")" after:command? {
   return Command.assemble(before, inner, after);
 }
 / only:commandPart {
   return new Command([only]);
 }

commandPart
 = text:commandLetter+ {
   return new CommandPart(text.join(""));
 }

commandLetter
 = [^$|)]
 / "$" ! "(" { return "$"; }
