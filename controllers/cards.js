const Card = require('../models/cards');

module.exports.getAllCards = (req, res) => {
  Card.find({})
  .then(cards => res.send({data: cards}))
  .catch((err) => {
    if (err.name === 'ValidationError'){
      res.status(400).send({message: 'Неправильный ввод данных'});
    }
    res.status(500).send({message: err.message})
  });
};

module.exports.createCard = (req, res) => {
  const {name, link} = req.body;
  const owner = req.user._id;
  Card.create({name, link, owner})
  .then(cards => res.send({data: cards}))
  .catch((err) => {
    if (err.name === 'ValidationError'){
      res.status(400).send({message: 'Неправильный ввод данных'});
    }
    res.status(500).send({message: err.message})
  });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
  .then(cards => res.send({data: cards}))
  .catch((err) => {
    res.status(500).send({message: err.message})
  });
};

module.exports.setLike = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
    {$addToSet: {likes:req.user._id }},
    {new: true},
  )
  .then(cards => {
    if(!cards) {
      res.status(404).send({message: 'Карточка не найдена'});
    }
    res.send({data: cards});
  })
  .catch((err) => {
    if(err.kind === 'ObjectId') {
      res.status(400).send({message: 'Получен неверный ID'});
    }
    res.status(500).send({message: err.message})
  });
};

module.exports.deleteLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {$pull: {likes: req.user._id}},
    {new: true},
  )
  .then(cards => {
    if(!cards) {
      res.status(404).send({message: 'Карточка не найдена'});
    }
    res.send({data: cards});
  })
  .catch((err) => {
    if(err.kind === 'ObjectId') {
      res.status(400).send({message: 'Получен неверный ID'});
    }
    res.status(500).send({message: err.message})
  });
};