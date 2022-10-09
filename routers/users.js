const routerUser = require('express').Router();

const {
  getUsers, getProfile, createProfile, editProfileInformation, editProfileAvatar,
} = require('../controllers/users');

routerUser.get('/users', getUsers);
routerUser.get('/users/:userId', getProfile);
routerUser.post('/users', createProfile);
routerUser.patch('/users/me', editProfileInformation);
routerUser.patch('/users/me/avatar', editProfileAvatar);

module.exports = routerUser;
