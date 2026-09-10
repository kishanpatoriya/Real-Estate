const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, default: '' },
  role: { type: String, enum: ['user', 'agent', 'admin'], default: 'user' },
  
  // Agent-Specific Fields
  designation: { type: String, default: 'Senior Luxury Specialist' },
  experience: { type: String, default: '1-3 Years' },
  location: { type: String, default: '' },
  bio: { type: String, default: '' },
  photo: { type: String, default: '' },
  reviews: [reviewSchema],

  // --- NAVE SUBSCRIPTION & BADGE FIELDS (ADDED) ---
  membershipPlan: { 
    type: String, 
    enum: ['free', 'standard', 'premium'], 
    default: 'free' 
  },
  propertyLimit: { 
    type: Number, 
    default: 1 
  },
  badgeType: { 
    type: String, 
    enum: ['none', 'yellow', 'green'], 
    default: 'none' 
  }
  // ----------------------------------------------

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);