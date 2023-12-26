const router = require('express').Router();
const User = require('../users/users-model');
const { restricted } = require('../middleware/auth-middleware');

router.get('/users', restricted, async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
