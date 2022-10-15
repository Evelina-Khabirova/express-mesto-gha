const routerUser = require('express').Router();
const {
  getUsers, getProfile, createProfile, getProfileId, editProfileInformation, editProfileAvatar,
} = require('../controllers/users');

routerUser.get('/users', getUsers);
routerUser.get('/users/me', getProfile);
routerUser.get('/users/:userId', getProfileId);
routerUser.post('/users', createProfile);
routerUser.patch('/users/me', editProfileInformation);
routerUser.patch('/users/me/avatar', editProfileAvatar);

module.exports = routerUser;
