const jwt = require('jsonwebtoken');

module.exports.auth = (req, res, next) => {
  try {
    const token = req.cookies;
    if (!token) {
      next({ message: 'Необходима авторизация' });
      return;
    }
    const payload = jwt.verify(token, 'some-secret-key');
    req.user = payload;
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      next({ message: 'Неправильный токен' });
    }
    next({ message: 'Ошибка на сервере' });
  }
  next();
};
