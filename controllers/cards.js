const Card = require('../models/cards');
const ServerError = require('../error/ServerError');
const NotFoundError = require('../error/NotFoundError');
const ValidationError = require('../error/ValidationError');

module.exports.getAllCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Неправильный ввод данных'));
      }
      next(new ServerError('Ошибка на сервере'));
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Неправильный ввод данных'));
      }
      next(new ServerError('Ошибка на сервере'));
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((cards) => {
      if (!cards) {
        next(new NotFoundError('Карточка не найдена'));
      }
      res.send({ data: cards });
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        next(new NotFoundError('Получен неверный ID'));
      }
      next(new ServerError('Ошибка на сервере'));
    });
};

module.exports.setLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((cards) => {
      if (!cards) {
        next(new NotFoundError('Карточка не найдена'));
      }
      res.send({ data: cards });
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        next(new NotFoundError('Получен неверный ID'));
      }
      next(new ServerError('Ошибка на сервере'));
    });
};

module.exports.deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((cards) => {
      if (!cards) {
        next(new NotFoundError('Карточка не найдена'));
      }
      res.send({ data: cards });
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        next(new NotFoundError('Получен неверный ID'));
      }
      next(new ServerError('Ошибка на сервере'));
    });
};
