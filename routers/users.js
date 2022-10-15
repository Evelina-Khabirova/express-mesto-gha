const routerUser = require('express').Router();
const { validateEditAvatar, validateEditUser, validateUserId } = require('../middlewares/validations');
const {
  getUsers, getProfile, getProfileId, editProfileInformation, editProfileAvatar,
} = require('../controllers/users');

routerUser.get('/users', getUsers);
routerUser.get('/users/me', getProfile);
routerUser.get('/users/:userId', validateUserId, getProfileId);
routerUser.patch('/users/me', validateEditUser, editProfileInformation);
routerUser.patch('/users/me/avatar', validateEditAvatar, editProfileAvatar);

module.exports = routerUser;
