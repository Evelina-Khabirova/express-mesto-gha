const Card = require('../models/cards');
const ERROR = require('../utils/utils');

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR.VALIDATION_ERROR).send({ message: 'Неправильный ввод данных' });
      }
      res.status(ERROR.SERVER_ERROR).send({ message: 'Ошибка на сервере' });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR.VALIDATION_ERROR).send({ message: 'Неправильный ввод данных' });
      }
      res.status(ERROR.SERVER_ERROR).send({ message: 'Ошибка на сервере' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((cards) => {
      if (!cards) {
        res.status(ERROR.ERROR_NOT_FOUND).send({ message: 'Карточка не найдена' });
      }
      res.send({ data: cards });
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        res.status(ERROR.VALIDATION_ERROR).send({ message: 'Получен неверный ID' });
      }
      res.status(ERROR.SERVER_ERROR).send({ message: 'Ошибка на сервере' });
    });
};

module.exports.setLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((cards) => {
      if (!cards) {
        res.status(ERROR.ERROR_NOT_FOUND).send({ message: 'Карточка не найдена' });
      }
      res.send({ data: cards });
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        res.status(ERROR.VALIDATION_ERROR).send({ message: 'Получен неверный ID' });
      }
      res.status(ERROR.SERVER_ERROR).send({ message: 'Ошибка на сервере' });
    });
};

module.exports.deleteLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((cards) => {
      if (!cards) {
        res.status(ERROR.ERROR_NOT_FOUND).send({ message: 'Карточка не найдена' });
      }
      res.send({ data: cards });
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        res.status(ERROR.VALIDATION_ERROR).send({ message: 'Получен неверный ID' });
      }
      res.status(ERROR.SERVER_ERROR).send({ message: 'Ошибка на сервере' });
    });
};
