const jwt = require('jsonwebtoken');
const USERS = require('../models/users');
const TOKEN = require('./token');

const getJwt = (_id) => {
  jwt.sign({ id: _id }, TOKEN.JWT_SECRET);
};

const isAuth = (token) => {
  jwt.verify(token, TOKEN.JWT_SECRET, (error, decoded) => {
    if (error) {
      return false;
    }
    return USERS.findOne({ _id: decoded._id })
      .then((users) => {
        Boolean(users);
      });
  });
};

module.exports = { getJwt, isAuth };
