const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const validator = require('validator');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

const URLErr = new Error('Неправильный формат ссылки');
URLErr.statusCode = 401;

const validateURL = (value) => {
  if (!validator.isURL(value, { require_protocol: true })) {
    throw URLErr;
  }
  return value;
};

const { PORT = 3000 } = process.env;
const pageNotFound = new Error('Страница не найдена');
pageNotFound.statusCode = 404;

const {
  createUser,
  login,

} = require('./controllers/users');

const user = require('./routes/users');
const card = require('./routes/cards');
const auth = require('./middlewares/auth');

// подключаемся к серверу mongo
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

// Массив доменов, с которых разрешены кросс-доменные запросы
const allowedCors = [
  'https://praktikum.tk',
  'http://praktikum.tk',
  'https://synkov.students.nomoredomains.work',
  'http://synkov.students.nomoredomains.work',
  'http://localhost:3006',
];

// подключаем мидлвары, роуты и всё остальное...
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);
app.use((req, res, next) => {
  const { origin } = req.headers; // Сохраняем источник запроса в переменную origin
  // проверяем, что источник запроса есть среди разрешённых
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  const { method } = req; // Сохраняем тип запроса (HTTP-метод) в соответствующую переменную

  // Значение для заголовка Access-Control-Allow-Methods по умолчанию (разрешены все типы запросов)
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS';
  // eslint-disable-next-line no-sequences
  const requestHeaders = req.headers['access-control-request-headers'];

  // Если это предварительный запрос, добавляем нужные заголовки
  if (method === 'OPTIONS') {
    if (allowedCors.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
    }
    // разрешаем кросс-доменные запросы любых типов (по умолчанию)
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    // разрешаем кросс-доменные запросы с этими заголовками
    res.header('Access-Control-Allow-Headers', requestHeaders);
    // завершаем обработку запроса и возвращаем результат клиенту
    return res.end();
  }
  return next();
});

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.custom(validateURL),
  }),
}), createUser);
app.use(auth);
app.use('/', user);
app.use('/', card);
app.use('/', (req, res, next) => {
  next(pageNotFound);
});
app.use(errorLogger);
app.use(errors());
app.use((err, req, res, next) => {
  next();
  if (err.statusCode) {
    return res.status(err.statusCode).send({ message: err.message });
  }
  const { statusCode = 500, message } = err;
  return res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? err.message
        : message,
    });
});

app.listen(PORT);
