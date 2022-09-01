const { FORBIDDEN_ERROR } = require('./statusCodes');

class Forbidden extends Error {
  constructor(message) {
    super(message);
    this.statusCode = FORBIDDEN_ERROR;
  }
}

module.exports = Forbidden;