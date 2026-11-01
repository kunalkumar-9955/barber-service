const express = require('express');
const User = require('../models/User');
const Shop = require('../models/Shop');
const Coupon = require('../models/Coupon');
const { protect, authorizeRoles } = require('../middleware/auth');

const router = express.Router();
router.use(protect, authorizeRoles('admin'));

router.get('/stats', async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalShops = await Shop.countDocuments();
    const coupons = await Coupon.find({ active: true }).limit(20);
    res.json({ totalUsers, totalShops, coupons });
  } catch (err) {
    next(err);
  }
});

router.get('/users', async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).limit(100);
    res.json({ users });
  } catch (err) {
    next(err);
  }
});

router.put('/user/:id/status', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.role = req.body.role || user.role;
    await user.save();
    res.json({ user });
  } catch (err) {
    next(err);
  }
});

router.post('/coupon', async (req, res, next) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ coupon });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
