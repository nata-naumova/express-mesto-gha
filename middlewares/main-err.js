const { INTERNAL_SERVER_ERROR, DEFAULT_ERROR_MESSAGE } = require('../constants');
/* 1. Реализуйте централизованную обработку ошибок */
module.exports = (err, req, res, next) => {
  const { statusCode = INTERNAL_SERVER_ERROR, message = DEFAULT_ERROR_MESSAGE } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === INTERNAL_SERVER_ERROR
        ? `err.name = ${err.name} ; err.message = ${err.message}`
        : message,
    });
  return next();
};
