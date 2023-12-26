const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../users/users-model');
const {
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength,
} = require('../middleware/auth-middleware');

router.post('/register', checkUsernameFree, checkPasswordLength, async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const hash = bcrypt.hashSync(password, 8);
    const newUser = await User.add({ username, password: hash });

    res.status(200).json(newUser);
  } catch (err) {
    next(err);
  }
});

router.post('/login', checkUsernameExists, async (req, res, next) => {
  try {
    const { password } = req.body;
    if (req.user && bcrypt.compareSync(password, req.user.password)) {
      req.session.user = req.user;
      res.status(200).json({ message: `Welcome ${req.user.username}!` });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    next(err);
  }
});

router.get('/logout', (req, res, next) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        next(err);
      } else {
        res.status(200).json({ message: 'logged out' });
      }
    });
  } else {
    res.status(200).json({ message: 'no session' });
  }
});

module.exports = router;
