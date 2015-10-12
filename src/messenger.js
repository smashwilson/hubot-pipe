"use strict";

var Messenger = module.exports = function (message) {
  this.message = message;
};

Messenger.isTextMessage = function (message) {
  var cname = message.constructor.name;
  return cname === 'TextMessage' || cname === 'SlackTextMessage';
};

Messenger.prototype.create = function (text) {
  var m = Object.create(this.message);
  m.text = text;
  m.done = false;
  return m;
};

Messenger.prototype.makeEnvelope = function (part) {
  return {
    part: part,
    room: this.message.room,
    user: this.message.user,
    message: this.message
  };
}
