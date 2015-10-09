# Hubot Pipe

[![Build Status](https://travis-ci.org/smashwilson/hubot-pipe.svg?branch=master)](https://travis-ci.org/smashwilson/hubot-pipe)

Introduce command piping and subshells to your Hubot commands. Coming soon!

```
# Expand the output from one command into the invocation of another.
hubot> hubot decide $(hubot echo first) $(hubot echo second)
Definitely "first".

# Append the output from one command to the input of another.
# Equivalent to "hubot echo before $(hubot echo after)".
hubot> hubot echo after | hubot echo before
before after
```
