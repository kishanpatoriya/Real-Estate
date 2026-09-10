const mongoose = require('mongoose');

// const propertySchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   location: { type: String, required: true },
//   price: { type: Number, required: true },
//   beds: { type: Number, required: true },
//   baths: { type: Number, required: true },
//   sqft: { type: Number, required: true },
//   image: { type: String, required: true },
//   description: { type: String },
// }, { timestamps: true });

const propertySchema = new mongoose.Schema({
  title: String,
  price: Number,
  location: String,
  beds: Number,
  baths: Number,
  sqft: Number,
  description: String,
  image: String,
  images: [String],
  agentEmail: String,
  agentName: String, // Yeh field honi zaroori hai
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Property', propertySchema);