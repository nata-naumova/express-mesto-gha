const Card = require('../models/card');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

// Получение карточек
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(next);
};

// Создание новой карточки
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('400 — Переданы некорректные данные при создании карточки.'));
      }
      return next(err);
    });
};

// Удаление карточки
module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((cards) => {
      if (!cards) {
        throw new NotFoundError('404 — Карточка не найдена.');
      }
      if (!cards.owner.equals(req.user._id)) {
        /* 9. Проконтролируйте права */
        throw new ForbiddenError('403 — Нельзя удалить чужую карточку. ');
      }
      return cards.remove().then(() => res.status(200).send(cards));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('400 — Ошибка обработки данных.'));
      }
      return next(err);
    });
};

// Поставить лайк
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('404 — Карточка не найдена.');
      }
      res.status(200).send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('400 — Ошибка обработки данных.'));
      }
      return next(err);
    });
};

// Удалить лайк
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('404 — Карточка не найдена. Лайк не удалось убрать.');
      }
      res.status(200).send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('400 — Ошибка обработки данных.'));
      }
      return next(err);
    });
};
