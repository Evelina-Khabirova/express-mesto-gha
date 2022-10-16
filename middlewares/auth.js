const jwt = require('jsonwebtoken');
const ERROR = require('../utils/utils');

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(ERROR.UNAUTHORIZED_ERROR).send({ message: 'Необходима авторизация' });
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    if (err.name === 'UnauthorizedError') {
      return res.status(ERROR.UNAUTHORIZED_ERROR).send({ message: 'Пользователь не авторизирован' });
    }
    return res.status(ERROR.SERVER_ERROR).send({ message: 'Ошибка на сервере' });
  }
  req.user = payload;
  return next();
};
