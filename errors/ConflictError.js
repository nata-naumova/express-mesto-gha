const { CONFLICT_ERROR } = require('../constants');

class ConflictError extends Error {
  constructor(message = 'Произошел конфликт') {
    super(message);
    this.statusCode = CONFLICT_ERROR;
  }
}

module.exports = ConflictError;
