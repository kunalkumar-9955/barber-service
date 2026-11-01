const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  city: { type: String, trim: true, required: true },
  address: { type: String, trim: true, required: true },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }
  },
  phone: { type: String, trim: true },
  description: { type: String, trim: true },
  services: [{ name: String, price: Number, duration: Number }],
  photos: [String],
  rating: { type: Number, default: 4.8 },
  reviewsCount: { type: Number, default: 0 },
  openNow: { type: Boolean, default: true },
  tags: [String],
  gallery: [String],
  createdAt: { type: Date, default: Date.now }
});

shopSchema.index({ location: '2dsphere' });
shopSchema.index({ name: 'text', description: 'text', city: 'text' });

module.exports = mongoose.model('Shop', shopSchema);
