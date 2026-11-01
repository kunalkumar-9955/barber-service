const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
  barber: { type: mongoose.Schema.Types.ObjectId, ref: 'Barber' },
  service: { name: String, price: Number, duration: Number },
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
  bookingType: { type: String, enum: ['shop', 'home'], default: 'shop' },
  address: { type: String },
  extraCharge: { type: Number, default: 0 },
  scheduledAt: { type: Date, required: true },
  paid: { type: Boolean, default: false },
  invoiceUrl: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);
