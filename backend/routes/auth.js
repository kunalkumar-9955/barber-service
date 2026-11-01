const express = require('express');
const { body } = require('express-validator');
const admin = require('../config/firebase');
const User = require('../models/User');
const { validateRequest } = require('../middleware/validate');
const { generateJwt } = require('../middleware/auth');

const router = express.Router();

router.post(
  '/firebase-login',
  [body('idToken').notEmpty().withMessage('Firebase token is required.')],
  validateRequest,
  async (req, res, next) => {
    try {
      const { idToken, referralCode } = req.body;
      const decoded = await admin.auth().verifyIdToken(idToken);
      const { uid, email, name, picture, phone_number } = decoded;

      let user = await User.findOne({ firebaseUid: uid });
      if (!user) {
        const code = `BP${Math.floor(1000 + Math.random() * 9000)}`;
        user = await User.create({
          firebaseUid: uid,
          name: name || 'Guest Stylist',
          email,
          phone: phone_number,
          avatar: picture,
          referralCode: code,
          referredBy: referralCode || undefined
        });
      } else {
        user.name = name || user.name;
        user.avatar = picture || user.avatar;
        await user.save();
      }

      const token = generateJwt(user);
      res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
      res.json({ token, user });
    } catch (err) {
      next(err);
    }
  }
);

router.get('/profile', async (req, res) => {
  res.json({ message: 'Send a request with Firebase token to /firebase-login and use the JWT to call protected routes.' });
});

module.exports = router;
