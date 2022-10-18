const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Users = require('../models/users');
const ServerError = require('../error/ServerError');
const NotFoundError = require('../error/NotFoundError');
const UnauthorizedError = require('../error/UnauthorizedError');
const ValidationError = require('../error/ValidationError');
const ConflictError = require('../error/ConflictError');

module.exports.getUsers = (req, res, next) => {
  Users.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Неправильный ввод данных'));
      }
      next(new ServerError('Ошибка на сервере'));
    });
};

module.exports.getProfile = (req, res, next) => {
  Users.findById(req.user._id)
    .then((users) => {
      if (!users) {
        next(new NotFoundError('Пользователь не найден'));
      }
      res.send({ data: users });
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        next(new ValidationError('Получен неверный ID'));
      }
      next(new ServerError('Ошибка на сервере'));
    });
};

module.exports.getProfileId = (req, res, next) => {
  Users.findById(req.params.userId)
    .then((users) => {
      if (!users) {
        next(new NotFoundError('Пользователь не найден'));
      }
      res.send({ data: users });
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        next(new ValidationError('Получен неверный ID'));
      }
      next(new ServerError('Ошибка на сервере'));
    });
};

module.exports.registerProfile = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next(new ValidationError('Неверный email или пароль'));
  }
  bcrypt.hash(password, 10, (error, hash) => {
    Users.findOne({ email })
      .then((users) => {
        if (users) {
          next(new ConflictError('Пользователь с такой почтой уже существует'));
        }
        Users.create({ ...req.body, password: hash })
          .then((user) => res.send({
            email: user.email,
            name: user.name,
            about: user.about,
            avatar: user.avatar,
            _id: user._id,
          }))
          .catch((err) => {
            if (err.name === 'ValidationError') {
              next(new ValidationError('Неправильный ввод данных'));
            }
            next(new ServerError('Ошибка на сервере'));
          });
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          next(new ValidationError('Неправильный ввод данных'));
        }
        next(new ServerError('Ошибка на сервере'));
      });
  });
};

module.exports.createProfile = (req, res, next) => {
  const { name, about, avatar } = req.body;
  Users.create({ name, about, avatar })
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Неправильный ввод данных'));
      }
      next(new ServerError('Ошибка на сервере'));
    });
};

module.exports.loginProfile = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next(new ValidationError('Неправильный ввод данных'));
  }
  Users.findOne({ email })
    .then((users) => {
      if (!users) {
        next(new UnauthorizedError('Такого пользователя не существует'));
      }
      bcrypt.compare(password, users.password, (error, isValidPassword) => {
        if (!isValidPassword) {
          next(new UnauthorizedError('Неверный пароль'));
        }
      });
      const token = jwt.sign({ _id: users._id }, 'some-secret-key', { expiresIn: '7d' });
      res.cookie('token', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      }).send({ token }).end();
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Неправильный ввод данных'));
      }
      next(new ServerError('Ошибка на сервере'));
    });
};

module.exports.editProfileInformation = (req, res, next) => {
  Users.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true })
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Неправильный ввод данных'));
      }
      next(new ServerError('Ошибка на сервере'));
    });
};

module.exports.editProfileAvatar = (req, res, next) => {
  Users.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true })
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Неправильный ввод данных'));
      }
      next(new ServerError('Ошибка на сервере'));
    });
};
