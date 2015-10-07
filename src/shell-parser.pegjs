{
  var ast = require('./ast');

  var Pipe = ast.Pipe;
  var Command = ast.Command;
  var CommandPart = ast.CommandPart;
}

expression
 = only:pipe { return only; }

pipe
 = left:command "|" [ \t]* right:pipe {
   return right.prefixedWith(left);
 }
 / only:command {
   return new Pipe([only]);
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
