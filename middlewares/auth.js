const jwt = require('jsonwebtoken');
const ServerError = require('../error/ServerError');
const UnauthorizedError = require('../error/UnauthorizedError');

module.exports.auth = (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      next(new UnauthorizedError('Необходима авторизация'));
      return;
    }
    const payload = jwt.verify(token, 'some-secret-key');
    req.user = payload;
  } catch (err) {
    if (err.name === 'UnauthorizedError') {
      next(new UnauthorizedError('Пользователь не авторизирован'));
      return;
    }
    next(new ServerError('Ошибка на сервере'));
  }
  next();
};
