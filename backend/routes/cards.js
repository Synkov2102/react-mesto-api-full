const cards = require('express').Router();

const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const URLErr = new Error('Неправильный формат ссылки');
URLErr.statusCode = 401;

const validateURL = (value) => {
  if (!validator.isURL(value, { require_protocol: true })) {
    throw URLErr;
  }
  return value;
};

const {
  createCard,
  findCards,
  deleteCardById,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

cards.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.custom(validateURL).required(),
  }),
}), createCard);

cards.get('/cards', findCards);

cards.delete('/cards/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), deleteCardById);

cards.put('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), likeCard);

cards.delete('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), dislikeCard);

module.exports = cards;
