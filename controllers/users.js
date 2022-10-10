const Users = require('../models/users');
const ERROR = require('../utils/utils');

module.exports.getUsers = (req, res) => {
  Users.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR.VALIDATION_ERROR).send({ message: 'Неправильный ввод данных' });
      }
      res.status(ERROR.SERVER_ERROR).send({ message: 'Ошибка на сервере' });
    });
};

module.exports.getProfile = (req, res) => {
  Users.findById(req.params.userId)
    .then((users) => {
      if (!users) {
        res.status(ERROR.ERROR_NOT_FOUND).send({ message: 'Пользователь не найден' });
      }
      res.send({ data: users });
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        res.status(ERROR.VALIDATION_ERROR).send({ message: 'Получен неверный ID' });
      }
      res.status(ERROR.SERVER_ERROR).send({ message: 'Ошибка на сервере' });
    });
};

module.exports.createProfile = (req, res) => {
  const { name, about, avatar } = req.body;
  Users.create({ name, about, avatar })
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR.VALIDATION_ERROR).send({ message: 'Неправильный ввод данных' });
      }
      res.status(ERROR.SERVER_ERROR).send({ message: 'Ошибка на сервере' });
    });
};

module.exports.editProfileInformation = (req, res) => {
  Users.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true })
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR.VALIDATION_ERROR).send({ message: 'Неправильный ввод данных' });
      }
      res.status(ERROR.SERVER_ERROR).send({ message: 'Ошибка на сервере' });
    });
};

module.exports.editProfileAvatar = (req, res) => {
  Users.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true })
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR.VALIDATION_ERROR).send({ message: 'Неправильный ввод данных' });
      }
      res.status(ERROR.SERVER_ERROR).send({ message: 'Ошибка на сервере' });
    });
};
