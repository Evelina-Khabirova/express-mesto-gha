const Users = require('../models/users');

module.exports.getUsers = (req, res) => {
  try {
    const users = Users.find({});
    res.status(200).send(users);
  }
  catch (err) {
    if (err.name === 'ValidatorError') {
      res.status(400).send({message: 'Введены неверные данные'});
      return;
    }
    res.status(500).send({message: err.message});
  }
};

module.exports.getProfile = (req, res) => {
  try {
    const user = Users.findById(req.params.userId);
    if(!user) {
      res.status(404).send({message: 'Пользователь не найден'});
      return;
    }
    res.status(200).send(user);
  }
  catch (err) {
    if (err.kind === 'ObjectId') {
      res.status(400).send({message: 'Введен неверный ID'});
      return;
    }
    res.status(500).send({message: err.message});
  }
};

module.exports.createProfile = (req, res) => {
  try {
    const {name, about, avatar} = req.body;
    const user = Users.create({name, about, avatar});
    res.status(200).send(user);
  }
  catch (err) {
    if (err.name === 'ValidatorError') {
      res.status(400).send({message: 'Введены неверные данные'});
      return;
    }
    res.status(500).send({message: err.message});
  }
}

module.exports.editProfileInformation = (req, res) => {
  try {
    const user = Users.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      res.status(404).send({message: 'Введен неверный ID'});
      return;
    }
    res.status(200).send(user);
  }
  catch (err) {
    if (err.name === 'ValidatorError') {
      res.status(400).send({message: 'Введены неверные данные'});
      return;
    }
    res.status(500).send({message: err.message});
  }
};

module.exports.editProfileAvatar = (req, res) => {
  try {
    const user = Users.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      res.status(404).send({message: 'Введен неверный ID'});
      return;
    }
    res.status(200).send(user);
  }
  catch (err) {
    if (err.name === 'ValidatorError') {
      res.status(400).send({message: 'Введены неверные данные'});
      return;
    }
    res.status(500).send({message: err.message});
  }
};