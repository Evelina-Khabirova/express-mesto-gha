const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routerUser = require('./routers/users');
const routerCard = require('./routers/cards');

const { ERROR_NOT_FOUND = 404 } = process.env;

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.user = {
    _id: '63418d9bbf4cfbadb6efc7f4',
  };
  next();
});
app.use('/users', routerUser);
app.use('/cards', routerCard);
app.use('*', (req, res, next) => {
  res.status(ERROR_NOT_FOUND).send({ message: 'Сервер не найден' });
  next();
});

function connect() {
  mongoose.connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
    useUnifiedTopology: false,
  });
  app.listen(PORT);
}

connect();
