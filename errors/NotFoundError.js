const { NOTFOUND_ERROR } = require('../constants');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = NOTFOUND_ERROR;
  }
}

module.exports = NotFoundError;
