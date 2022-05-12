const Card = require('../models/cards');

const cardErr = new Error('Карточка принадлежит другому пользователю');
cardErr.statusCode = 403;

const incorrectDataErr = new Error('Переданы некорректные данные');
incorrectDataErr.statusCode = 400;

const notFoundErr = new Error('Карточка не найдена');
notFoundErr.statusCode = 404;

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ card }))
    .catch((err) => {
      if ((err.name === 'CastError') || (err.name === 'ValidationError')) {
        next(incorrectDataErr);
      }
      next(err);
    });
};

module.exports.deleteCardById = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) { throw notFoundErr; }
      if (String(card.owner._id) !== req.user._id) {
        return Promise.reject(cardErr);
      }
      return card.remove();
    })
    .then((deleted) => res.send({ deleted }))
    .catch((err) => {
      if ((err.name === 'CastError') || (err.name === 'ValidationError')) {
        next(incorrectDataErr);
      }
      next(err);
    });
};

module.exports.findCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ cards }))
    .catch((err) => next(err));
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) { throw notFoundErr; }
      return res.send({ card });
    })
    .catch((err) => {
      if ((err.name === 'CastError') || (err.name === 'ValidationError')) {
        next(incorrectDataErr);
      }
      next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) { throw notFoundErr; }
      return res.send({ card });
    })
    .catch((err) => {
      if ((err.name === 'CastError') || (err.name === 'ValidationError')) {
        next(incorrectDataErr);
      }
      next(err);
    });
};
