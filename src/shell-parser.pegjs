{
  var ast = require('./ast');
}

expression
 = only:pipeSequence { return only; }

pipeSequence
 = left:command+ "|" right:pipeSequence {
   return right.prefixedWith(left);
 }
 / only:command+ {
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
 = text:.+ {
   return new CommandPart(text);
 }