const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  propertyTitle: { type: String, required: true },
  agentName: { type: String },
  agentEmail: { type: String },
  userId: { type: String },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  phone: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  status: { type: String, default: 'Pending' }, // 'Pending', 'Confirmed', 'Cancelled'
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);