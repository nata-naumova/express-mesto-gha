const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      if (cards.length === 0) {
        res.status(400).send({ message: 'Карточки не найдены.' });
        return;
      }
      res.status(200).send(cards);
    })
    .catch(() => res.status(500).send({ message: 'Внутренняя ошибка сервера.' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link })
    .then((card) => res.status(200).send(card))
    .catch(() => res.status(500).send({ message: 'Внутренняя ошибка сервера.' }));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Карточка не найдена.' });
        return;
      }
      res.status(200).send(card);
    })
    .catch(() => res.status(500).send({ message: 'Внутренняя ошибка сервера.' }));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.status(200).send(card))
    .catch(() => res.status(500).send({ message: 'Внутренняя ошибка сервера.' }));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.status(200).send(card))
    .catch(() => res.status(500).send({ message: 'Внутренняя ошибка сервера.' }));
};
