const BAD_REQUEST = 400;
const UNAUTHORIZED_ERROR = 401;
const FORBIDDEN_ERROR = 403;
const NOTFOUND_ERROR = 404;
const CONFLICT_ERROR = 409;
const INTERNAL_SERVER_ERROR = 500;
const DEFAULT_ERROR_MESSAGE = '500 — Внутренняя ошибка сервера.';
const SEKRET_KEY = 'some-secret-key';

/* 3. Валидируйте данные на уровне схемы */
const AVATAR_REGEX = /^https?:\/\/(www\.)?[a-zA-Z\d-]+\.[\w\d\-.~:/?#[\]@!$&'()*+,;=]{2,}#?$/;

module.exports = {
  BAD_REQUEST,
  UNAUTHORIZED_ERROR,
  FORBIDDEN_ERROR,
  NOTFOUND_ERROR,
  CONFLICT_ERROR,
  INTERNAL_SERVER_ERROR,
  DEFAULT_ERROR_MESSAGE,
  SEKRET_KEY,
  AVATAR_REGEX,
};
