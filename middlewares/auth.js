const jwt = require('jsonwebtoken');
const ServerError = require('../error/ServerError');
const UnauthorizedError = require('../error/UnauthorizedError');

module.exports.auth = (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      next(new UnauthorizedError('Отсутствует токен'));
      return;
    }
    const payload = jwt.verify(token, 'some-secret-key');
    req.user = payload;
    res.send({ message: 'Пользователь успешно авторизирован' });
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      next(new UnauthorizedError('Некорректный токен'));
      return;
    }

    next(new ServerError(err));
  }
  next();
};
