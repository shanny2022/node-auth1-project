const User = require('../users/users-model')

function restricted(req, res, next) {
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).json({ message: 'You shall not pass!' });
  }
}

async function checkUsernameFree(req, res, next) {
  const users = await User.findBy({ username: req.body.username });
  if (users.length) {
    res.status(422).json({ message: 'Username taken' });
  } else {
    next();
  }
}

async function checkUsernameExists(req, res, next) {
  const users = await User.findBy({ username: req.body.username });
  if (users.length) {
    req.user = users[0];
    next();
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
}

function checkPasswordLength(req, res, next) {
  if (req.body.password && req.body.password.length > 3) {
    next();
  } else {
    res.status(422).json({ message: 'Password must be longer than 3 chars' });
  }
}

module.exports = {
  restricted,
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength,
}
