const Users = require('../models/users');

module.exports.getUsers = (req, res) => {
  Users.find({})
  .then(users => res.send({data: users}))
  .catch((err) => {
    if (err.name === 'ValidationError'){
      res.status(400).send({message: 'Неправильный ввод данных'});
    }
    res.status(500).send({message: err.message})
  });
};

module.exports.getProfile = (req, res) => {
  Users.findById(req.params.userId)
  .then(users => res.send({data: users}))
  .catch((err) => {
    res.status(500).send({message: err.message})
  });
};

module.exports.createProfile = (req, res) => {
  const {name, about, avatar} = req.body;
  Users.create({name, about, avatar})
  .then(users => res.send({data: users}))
  .catch((err) => {
    if (err.name === 'ValidationError'){
      res.status(400).send({message: 'Неправильный ввод данных'});
    }
    res.status(500).send({message: err.message})
  });
}

module.exports.editProfileInformation = (req, res) => {
  Users.findByIdAndUpdate(req.user._id, req.body, {new: true, runValidators: true})
  .then(users => res.send({data: users}))
  .catch((err) => {
    if (err.name === 'ValidationError'){
      res.status(400).send({message: 'Неправильный ввод данных'});
    }
    res.status(500).send({message: err.message})
  });
};

module.exports.editProfileAvatar = (req, res) => {
  Users.findByIdAndUpdate(req.user._id, req.body, {new: true, runValidators: true})
  .then(users => res.send({data: users}))
  .catch((err) => {
    if (err.name === 'ValidationError'){
      res.status(400).send({message: 'Неправильный ввод данных'});
    }
    res.status(500).send({message: err.message})
  });
};