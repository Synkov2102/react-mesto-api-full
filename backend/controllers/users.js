const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

const userErr = new Error('Неправильная почта или пароль');
userErr.statusCode = 401;

const incorrectDataErr = new Error('Переданы некорректные данные');
incorrectDataErr.statusCode = 400;

const notFoundErr = new Error('Пользователь не найден');
notFoundErr.statusCode = 404;

const sameEmailErr = new Error('Пользователь c такой почтой уже зарегистрирован');
sameEmailErr.statusCode = 409;

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name, about, avatar,
    }))
    .then(() => res.send({
      data: {
        name, about, avatar, email,
      },
    }))
    .catch((err) => {
      if (err.code === 11000) { next(sameEmailErr); }
      next(err);
    });
};

module.exports.findUserById = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) { throw notFoundErr; }
      return res.send({ user });
    })
    .catch((err) => {
      if ((err.name === 'CastError') || (err.name === 'ValidationError')) {
        next(incorrectDataErr);
      }
      next(err);
    });
};

module.exports.findUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) => next(err));
};

module.exports.findCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) { throw notFoundErr; }
      return res.send({ user });
    })
    .catch((err) => {
      if ((err.name === 'CastError') || (err.name === 'ValidationError')) {
        next(incorrectDataErr);
      }
      next(err);
    });
};

module.exports.patchUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) { throw notFoundErr; }
      return res.send({ user });
    })
    .catch((err) => {
      if ((err.name === 'CastError') || (err.name === 'ValidationError')) {
        next(incorrectDataErr);
      }
      next(err);
    });
};

module.exports.patchUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) { throw notFoundErr; }
      return res.send({ user });
    })
    .catch((err) => {
      if ((err.name === 'CastError') || (err.name === 'ValidationError')) {
        next(incorrectDataErr);
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  let token = '';
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw userErr;
      }
      token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key', { expiresIn: '7d' });
      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        // хеши не совпали — отклоняем промис
        throw userErr;
      }

      // аутентификация успешна
      return res
        .status(200)
        .send({ token });
    })
    .catch((err) => {
      if ((err.name === 'CastError') || (err.name === 'ValidationError')) {
        next(incorrectDataErr);
      }
      next(err);
    });
};
