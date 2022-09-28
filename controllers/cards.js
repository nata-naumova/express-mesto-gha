const Card = require('../models/card');

// Получение карточек
module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => {
      if (cards.length === 0) {
        res.status(404).send({ message: 'Карточки на найдены.' });
        return;
      }
      res.status(200).send(cards);
    })
    .catch(() => {
      res.status(500).send({ message: 'Внутренняя ошибка сервера.' });
    });
};

// Создание новой карточки
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы неверные данные.' });
        return;
      }
      res.status(500).send({ message: 'Внутренняя ошибка сервера.' });
    });
};

// Удаление карточки
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((cards) => {
      if (!cards) {
        res.status(404).send({ message: 'Карточка не найдена.' });
        return;
      }
      res.status(200).send(cards);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Ошибка обработки данных' });
        return;
      }
      res.status(500).send({ message: 'Внутренняя ошибка сервера.' });
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
        res.status(404).send({ message: 'Объект не найден' });
        return;
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Ошибка обработки данных' });
      }
      return res.status(500).send({ message: 'Ошибка работы сервера' });
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
        res.status(404).send({ message: 'Карточка не найдена. Лайк не удалось убрать.' });
        return;
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Ошибка обработки данных' });
      }
      return res.status(500).send({ message: 'Ошибка работы сервера' });
    });
};
