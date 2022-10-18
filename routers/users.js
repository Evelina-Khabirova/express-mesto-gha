const routerUser = require('express').Router();
const { validateUserId, validateEditAvatar, validateEditProfile, validateCreateProfile } = require('../middlewares/validations');
const {
  getUsers, getProfile, createProfile, getProfileId, editProfileInformation, editProfileAvatar,
} = require('../controllers/users');

routerUser.get('/users', getUsers);
routerUser.get('/users/me', getProfile);
routerUser.get('/users/:userId', validateUserId, getProfileId);
routerUser.post('/users', validateCreateProfile, createProfile);
routerUser.patch('/users/me', validateEditProfile, editProfileInformation);
routerUser.patch('/users/me/avatar', validateEditAvatar, editProfileAvatar);

module.exports = routerUser;
