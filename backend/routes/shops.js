const express = require('express');
const { body } = require('express-validator');
const Shop = require('../models/Shop');
const User = require('../models/User');
const { protect, authorizeRoles } = require('../middleware/auth');
const cloudinary = require('../utils/cloudinary');
const { validateRequest } = require('../middleware/validate');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { city, rating, minPrice, maxPrice, search } = req.query;
    const query = { openNow: true };
    if (city) query.city = new RegExp(city, 'i');
    if (rating) query.rating = { $gte: Number(rating) };
    if (search) query.$text = { $search: search };
    const shops = await Shop.find(query)
      .sort({ rating: -1, createdAt: -1 })
      .limit(40);
    res.json({ shops });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (!shop) return res.status(404).json({ error: 'Shop not found' });
    res.json({ shop });
  } catch (err) {
    next(err);
  }
});

router.post(
  '/create',
  protect,
  authorizeRoles('barber', 'admin'),
  [
    body('name').notEmpty(),
    body('city').notEmpty(),
    body('address').notEmpty(),
    body('services').isArray({ min: 1 })
  ],
  validateRequest,
  async (req, res, next) => {
    try {
      const shop = await Shop.create({
        ...req.body,
        owner: req.user._id,
        location: { type: 'Point', coordinates: [req.body.longitude || 0, req.body.latitude || 0] }
      });
      res.status(201).json({ shop });
    } catch (err) {
      next(err);
    }
  }
);

router.post('/upload', protect, authorizeRoles('barber', 'admin'), async (req, res, next) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({ error: 'Image file is required.' });
    }
    const upload = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
      folder: 'barberpro/shops',
      transformation: [{ width: 1200, crop: 'limit' }]
    });
    res.json({ url: upload.secure_url });
  } catch (err) {
    next(err);
  }
});

router.put('/gallery/:id', protect, authorizeRoles('barber', 'admin'), async (req, res, next) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (!shop) return res.status(404).json({ error: 'Shop not found' });
    if (shop.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized shop update' });
    }
    shop.photos = [...new Set([...(shop.photos || []), req.body.photo])];
    await shop.save();
    res.json({ shop });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
