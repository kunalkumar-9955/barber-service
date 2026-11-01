const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  balance: { type: Number, default: 0 },
  currency: { type: String, default: 'INR' },
  rewards: { type: Number, default: 0 }
});

const userSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, unique: true },
  phone: { type: String, trim: true },
  role: { type: String, enum: ['user', 'barber', 'admin'], default: 'user' },
  avatar: { type: String },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Shop' }],
  wallet: walletSchema,
  referralCode: { type: String, unique: true, sparse: true },
  referredBy: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
