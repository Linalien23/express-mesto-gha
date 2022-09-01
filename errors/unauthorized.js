const { UNAUTHORIZED_ERROR } = require('./statusCodes');

class Unauthorized extends Error {
  constructor(message) {
    super(message);
    this.statusCode = UNAUTHORIZED_ERROR;
  }
}
module.exports = Unauthorized;