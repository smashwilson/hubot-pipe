# Hubot Pipe

[![Greenkeeper badge](https://badges.greenkeeper.io/smashwilson/hubot-pipe.svg)](https://greenkeeper.io/)

[![Build Status](https://travis-ci.org/smashwilson/hubot-pipe.svg?branch=master)](https://travis-ci.org/smashwilson/hubot-pipe)

Introduce command piping and subshells to your Hubot commands.

```
# Expand the output from one command into the invocation of another.
hubot> hubot decide $(hubot echo first) $(hubot echo second)
Definitely "first".

# Append the output from one command to the input of another.
# Equivalent to "hubot echo before $(hubot echo after)".
hubot> hubot echo after | hubot echo before
before after
```

Subcommands can be nested at arbitrary depths. Pipe sequences can be arbitrarily long, and used within subcommands. (Okay, realistically you're limited by the stack depth.)

```
pushbot> pushbot echo outer-start $(pushbot echo middle-start $(pushbot echo inner) middle-end) outer-end
outer-start middle-start inner middle-end outer-end

pushbot> pushbot echo 0 $(pushbot echo 2 | pushbot echo 1 )3
pushbot> 0 1 2 3
```

## Installing

1. Add `hubot-pipe` to your `package.json` with `npm install --save hubot-pipe`:

  ```json
    "dependencies": {
      "hubot-pipe": "~0.0.4"
    },
  ```
2. Require the module in `external-scripts.json`:

  ```json
  ["hubot-pipe"]
  ```
3. Run `npm update` and restart your Hubot.
