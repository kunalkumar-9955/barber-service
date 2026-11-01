const express = require('express');
const { body } = require('express-validator');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { protect } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validate');

const router = express.Router();

router.use(protect);

router.get('/me', async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');
    res.json({ user });
  } catch (err) {
    next(err);
  }
});

router.put(
  '/update',
  [body('name').optional().isString(), body('phone').optional().isMobilePhone('any')],
  validateRequest,
  async (req, res, next) => {
    try {
      const updates = req.body;
      const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).populate('favorites');
      res.json({ user });
    } catch (err) {
      next(err);
    }
  }
);

router.get('/notifications', async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ notifications });
  } catch (err) {
    next(err);
  }
});

router.post('/favorite/:shopId', async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const shopId = req.params.shopId;
    const exists = user.favorites.includes(shopId);
    if (exists) {
      user.favorites = user.favorites.filter((id) => id.toString() !== shopId);
    } else {
      user.favorites.push(shopId);
    }
    await user.save();
    res.json({ favorites: user.favorites });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
