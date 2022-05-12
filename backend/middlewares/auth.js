const jwt = require('jsonwebtoken');

const avtorizationErr = new Error('Необходима авторизация');
avtorizationErr.statusCode = 401;

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(avtorizationErr);
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return next(avtorizationErr);
  }
  req.user = payload;
  return next();
};
