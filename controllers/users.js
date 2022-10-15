const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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
  bcrypt.hash(req.body.password, 10)
    .then((hash) => Users.create({
      email: req.body.email,
      password: hash,
    }))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR.VALIDATION_ERROR).send({ message: 'Неправильный ввод данных' });
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

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  return Users.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });
      if (!user) {
        res.status(ERROR.ERROR_NOT_FOUND).send({ message: 'Неправильные почта или пароль' });
      }
      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      res.send({ message: 'Всё верно!' });
    })
    .catch((err) => {
      if (err.name === 'UnauthorizedError') {
        res.status(ERROR.UNAUTHORIZED_ERROR).send({ message: 'Неверный email' });
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
