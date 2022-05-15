const user = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const URLErr = new Error('Неправильный формат ссылки');
URLErr.statusCode = 400;
const validator = require('validator');

const validateURL = (value) => {
  if (!validator.isURL(value, { require_protocol: true })) {
    throw URLErr;
  }
  return value;
};

const {
  findUsers,
  findUserById,
  findCurrentUser,
  patchUser,
  patchUserAvatar,
} = require('../controllers/users');

user.get('/users', findUsers);

user.get('/users/me', findCurrentUser);

user.get('/users/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required(),
  }),
}), findUserById);

user.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), patchUser);

user.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.custom(validateURL).required(),
  }),
}), patchUserAvatar);

module.exports = user;
