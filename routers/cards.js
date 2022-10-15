const routerCard = require('express').Router();
const {
  getAllCards, createCard, deleteCard, setLike, deleteLike,
} = require('../controllers/cards');

routerCard.get('/cards', getAllCards);
routerCard.post('/cards', createCard);
routerCard.delete('/cards/:cardId', deleteCard);
routerCard.put('/cards/:cardId/likes', setLike);
routerCard.delete('/cards/:cardId/likes', deleteLike);

module.exports = routerCard;
