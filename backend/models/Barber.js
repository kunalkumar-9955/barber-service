const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  name: String,
  experience: String,
  specialty: String,
  active: { type: Boolean, default: true }
});

const barberSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' },
  bio: { type: String, trim: true },
  rating: { type: Number, default: 4.7 },
  totalReviews: { type: Number, default: 0 },
  services: [{ name: String, price: Number, duration: Number }],
  availability: [{ day: String, slots: [String] }],
  portfolio: [String],
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Barber', barberSchema);
