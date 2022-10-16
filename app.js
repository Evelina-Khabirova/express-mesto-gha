const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const routerUser = require('./routers/users');
const routerCard = require('./routers/cards');
const { loginProfile, registerProfile } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const { validateLogin, validateCreateProfile } = require('./middlewares/validations');
const ERROR = require('./utils/utils');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.post('/signin', validateLogin, loginProfile);
app.post('/signup', validateCreateProfile, registerProfile);
app.use(auth);
app.use('/', routerUser);
app.use('/', routerCard);
app.use(errors());
app.use('*', (req, res, next) => {
  res.status(ERROR.ERROR_NOT_FOUND).send({ message: 'Сервер не найден' });
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
