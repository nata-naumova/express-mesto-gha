const User = require('../models/user');
const {
  NOTFOUND_ERROR,
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST,
  DEFAULT_ERROR_MESSAGE,
} = require('../errors/errors');

// Получение пользователей
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(() => {
      res.status(INTERNAL_SERVER_ERROR).send({ message: DEFAULT_ERROR_MESSAGE });
    });
};
// Получение пользователя по его id
module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(NOTFOUND_ERROR).send({ message: 'Пользователь по указанному _id не найден.' });
        return;
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: '400 — Переданы некорректные данные _id.' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: DEFAULT_ERROR_MESSAGE });
    });
};
// Создание нового пользователя
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => { res.status(200).send(user); })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: '400 — Переданы некорректные данные при создании пользователя.' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: DEFAULT_ERROR_MESSAGE });
    });
};
// Обновление информации о пользователе
module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        res.status(NOTFOUND_ERROR).send({ message: 'Пользователь по указанному _id не найден.' });
        return;
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: '400 — Переданы некорректные данные при обновлении информации пользователя.' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: DEFAULT_ERROR_MESSAGE });
    });
};

// Обновление аватара пользователя
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        res.status(NOTFOUND_ERROR).send({ message: 'Пользователь по указанному _id не найден.' });
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: '400 — Переданы некорректные данные при обновлении аватара пользователя.' });
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: DEFAULT_ERROR_MESSAGE });
    });
};
