const Card = require('../models/cards');

module.exports.getAllCards = (req, res) => {
  try {
    const cards = Card.find({});
    res.status(200).send(cards);
  }
  catch (err) {
    if (err._message === 'card validation failed') {
      res.status(400).send({message: 'Введены неверные данные'});
    }
    res.send({message: err.message});
  }
};

module.exports.createCard = (req, res) => {
  try {
    const {name, link} = req.body;
    const owner = req.user._id;
    const card = Card.create({name, link, owner});
    res.status(200).send(card);
  }
  catch (err) {
    if (err._message === 'card validation failed') {
      res.status(400).send({message: 'Введены неверные данные'});
    }
    res.status(500).send({message: err.message});
  }
};

module.exports.deleteCard = (req, res) => {
  try {
    const card = Card.findByIdAndRemove(req.params.cardId);
    if (!card) {
      res.status(404).send({message: 'Карточка не найдена'});
      return;
    }
    res.status(200).send(card);
  }
  catch (err) {
    res.status(500).send({message: err.message});
  }
};

module.exports.setLike = (req, res) => {
  try {
    const card = Card.findByIdAndUpdate(
      req.params.cardId,
      {$addToSet: {likes:req.user._id }},
      {new: true},
    );
    if (!card) {
      res.status(404).send({message: 'Карточка не найдена'});
      return;
    }
    res.status(200).send(card);
  }
  catch (err) {
    if (err.kind === 'ObjectId') {
      res.status(400).send({message: 'Введены неверные данные'});
      return;
    }
    res.status(500).send({message: err.message});
  }
};

module.exports.deleteLike = (req, res) => {
  try {
    const card = Card.findByIdAndUpdate(
      req.params.cardId,
      {$pull: {likes: req.user._id}},
      {new: true},
    );
    if (!card) {
      res.status(404).send({message: 'Карточка не найдена'});
      return;
    }
    res.status(200).send(card);
  }
  catch (err) {
    if (err.kind === 'ObjectId') {
      res.status(400).send({message: 'Введены неверные данные'});
      return;
    }
    res.status(500).send({message: err.message});
  }
};