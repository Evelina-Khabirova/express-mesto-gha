const Users = require('../models/users');

const { VALIDATION_ERROR = 400, ERROR_NOT_FOUND = 404, SERVER_ERROR = 500 } = process.env;

module.exports.getUsers = (req, res) => {
  Users.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(VALIDATION_ERROR).send({ message: 'Неправильный ввод данных' });
      }
      res.status(SERVER_ERROR).send({ message: err.message });
    });
};

module.exports.getProfile = (req, res) => {
  Users.findById(req.params.userId)
    .then((users) => {
      if (!users) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь не найден' });
      }
      res.send({ data: users });
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        res.status(VALIDATION_ERROR).send({ message: 'Получен неверный ID' });
      }
      res.status(SERVER_ERROR).send({ message: err.message });
    });
};

module.exports.createProfile = (req, res) => {
  const { name, about, avatar } = req.body;
  Users.create({ name, about, avatar })
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(VALIDATION_ERROR).send({ message: 'Неправильный ввод данных' });
      }
      res.status(SERVER_ERROR).send({ message: err.message });
    });
};

module.exports.editProfileInformation = (req, res) => {
  Users.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true })
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(VALIDATION_ERROR).send({ message: 'Неправильный ввод данных' });
      }
      res.status(SERVER_ERROR).send({ message: err.message });
    });
};

module.exports.editProfileAvatar = (req, res) => {
  Users.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true })
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(VALIDATION_ERROR).send({ message: 'Неправильный ввод данных' });
      }
      res.status(SERVER_ERROR).send({ message: err.message });
    });
};
