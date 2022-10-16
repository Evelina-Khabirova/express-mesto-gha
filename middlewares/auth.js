const jwt = require('jsonwebtoken');
const ServerError = require('../error/ServerError');
const UnauthorizedError = require('../error/UnauthorizedError');

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError('Необходима авторизация'));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    if (err.name === 'UnauthorizedError') {
      next(new UnauthorizedError('Пользователь не авторизирован'));
    }
    next(new ServerError('Ошибка на сервере'));
  }
  req.user = payload;
  return next();
};
