const bcrypt = require('bcryptjs');
const Users = require('../models/users');
const ERROR = require('../utils/utils');
const { getJwt, isAuth } = require('../utils/jwt');

module.exports.getUsers = (req, res) => {
  Users.find({})
    .then((users) => {
      if (!isAuth(req.headers.authorization)) {
        res.status(ERROR.UNAUTHORIZED_ERROR).send({ message: 'Пользователь не авторизирован' });
      }
      res.send({ data: users });
    })
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
      if (!isAuth(req.headers.authorization)) {
        res.status(ERROR.UNAUTHORIZED_ERROR).send({ message: 'Пользователь не авторизирован' });
      }
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

module.exports.getProfileId = (req, res) => {
  Users.findById(req.user._id)
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

module.exports.registerProfile = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(ERROR.VALIDATION_ERROR).send({ message: 'Неверный email или пароль' });
  }
  bcrypt.hash(password, 10, (error, hash) => {
    Users.findOne({ email })
      .then((users) => {
        if (users) {
          res.status(ERROR.FORBIDDEN_ERROR).send({ message: 'Пользователь с такой почтой уже существует' });
        }
        Users.create({ ...req.body, password: hash })
          .then((user) => res.send(user))
          .catch((err) => {
            if (err.name === 'ValidationError') {
              res.status(ERROR.VALIDATION_ERROR).send({ message: 'Неправильный ввод данных' });
            }
            res.status(ERROR.SERVER_ERROR).send({ message: 'Ошибка на сервере' });
          });
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(ERROR.VALIDATION_ERROR).send({ message: 'Неправильный ввод данных' });
        }
        res.status(ERROR.SERVER_ERROR).send({ message: 'Ошибка на сервере' });
      });
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

module.exports.loginProfile = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(ERROR.VALIDATION_ERROR).send({ message: 'Неверный email или пароль' });
  }
  Users.findOne({ email })
    .then((users) => {
      if (!users) {
        res.status(ERROR.FORBIDDEN_ERROR).send({ message: 'Такого пользователя не существует' });
      }
      bcrypt.compare(password, users.password, (error, isValidPassword) => {
        if (!isValidPassword) {
          res.status(ERROR.UNAUTHORIZED_ERROR).send({ message: 'Неверный пароль' });
        }
        const token = getJwt(users._id);
        res.send({ token });
      });
    })
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
