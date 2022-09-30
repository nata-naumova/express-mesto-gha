const Card = require('../models/card');
const {
  NOTFOUND_ERROR,
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST,
  DEFAULT_ERROR_MESSAGE,
} = require('../errors/errors');

// Получение карточек
module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(() => {
      res.status(INTERNAL_SERVER_ERROR).send({ message: DEFAULT_ERROR_MESSAGE });
    });
};

// Создание новой карточки
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: '400 — Переданы некорректные данные при создании карточки.' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: DEFAULT_ERROR_MESSAGE });
    });
};

// Удаление карточки
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((cards) => {
      if (!cards) {
        res.status(NOTFOUND_ERROR).send({ message: '404 — Карточка не найдена.' });
        return;
      }
      res.status(200).send(cards);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: '400 — Ошибка обработки данных.' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: DEFAULT_ERROR_MESSAGE });
    });
};

// Поставить лайк
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(NOTFOUND_ERROR).send({ message: '404 — Карточка не найдена.' });
        return;
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: '400 — Ошибка обработки данных.' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: DEFAULT_ERROR_MESSAGE });
    });
};

// Удалить лайк
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(NOTFOUND_ERROR).send({ message: '404 — Карточка не найдена. Лайк не удалось убрать.' });
        return;
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: '400 — Ошибка обработки данных.' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: DEFAULT_ERROR_MESSAGE });
    });
};
