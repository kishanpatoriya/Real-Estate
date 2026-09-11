const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const User = require('./models/User');
const Property = require('./models/Property');
const Booking = require('./models/Booking');

// --- NEWSLETTER SCHEMA & MODEL ---
const newsletterSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});
const Newsletter = mongoose.model('Newsletter', newsletterSchema);

// --- CONTACT INQUIRY SCHEMA & MODEL ---
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  interest: { type: String },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
const Contact = mongoose.model('Contact', contactSchema);

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

// Ensure uploads folder exists automatically on Render server
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use('/uploads', express.static(uploadDir));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

const createAdminDirectly = async () => {
  try {
    const existingAdmin = await User.findOne({ email: "admin@gmail.com" });
    const hashedPassword = await bcrypt.hash("admin123", 10);
    
    if (existingAdmin) {
      existingAdmin.password = hashedPassword;
      existingAdmin.role = "admin";
      await existingAdmin.save();
      console.log("Admin account updated successfully!");
    } else {
      const newAdmin = new User({
        name: "Admin",
        email: "admin@gmail.com",
        password: hashedPassword,
        role: "admin"
      });
      await newAdmin.save();
      console.log("Default Admin created successfully!");
    }
  } catch (err) {
    console.log("Error creating admin:", err);
  }
};

const createAgentDirectly = async () => {
  try {
    const existingAgent = await User.findOne({ email: "kishapatoriya2007@gmail.com" });
    const hashedPassword = await bcrypt.hash("kishan", 10);
    
    if (existingAgent) {
      existingAgent.password = hashedPassword;
      existingAgent.role = "agent";
      await existingAgent.save();
      console.log("Agent account updated successfully!");
    } else {
      const newAgent = new User({
        name: "Kishan",
        email: "kishapatoriya2007@gmail.com",
        password: hashedPassword,
        phone: "+91 98765 43210",
        designation: "Senior Luxury Specialist",
        experience: "5+ Years",
        location: "Jamnagar & Ahmedabad, Gujarat",
        role: "agent"
      });
      await newAgent.save();
      console.log("Default Agent created successfully!");
    }
  } catch (err) {
    console.log("Error creating agent:", err);
  }
};

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected Successfully to GharSetu Database');
    createAdminDirectly();
    createAgentDirectly();
  })
  .catch((err) => console.log("DB Connection Error:", err));

// --- AUTH & AGENT ROUTES ---

// User Registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      phone: phone || '',
      password: hashedPassword,
      role: 'user'
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Agent Registration
app.post('/api/agents/register', async (req, res) => {
  try {
    const { name, email, password, phone, designation, experience, location } = req.body;

    const existingAgent = await User.findOne({ email });
    if (existingAgent) {
      return res.status(400).json({ message: 'An account already exists with this email!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAgent = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      designation: designation || 'Senior Luxury Specialist',
      experience: experience || '1-3 Years',
      location: location || 'Gujarat',
      role: 'agent',
      membershipPlan: 'free',
      propertyLimit: 1,
      badgeType: 'none'
    });

    await newAgent.save();
    res.status(201).json({ message: 'Agent registered successfully!' });
  } catch (err) {
    console.error("Agent registration error:", err);
    res.status(500).json({ error: err.message });
  }
});

// User & Admin Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Account does not exist or has been removed by administrator!' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password!' });
    }

    res.status(200).json({
      token: user._id,
      role: user.role,
      name: user.name,
      email: user.email,
      phone: user.phone,
      message: 'Login successful'
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Agent Login
app.post('/api/agents/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const agent = await User.findOne({ email, role: 'agent' });
    if (!agent) {
      return res.status(401).json({ message: "Invalid agent credentials or account not found!" });
    }

    let isMatch = false;
    if (agent.password.startsWith('$2a$') || agent.password.startsWith('$2b$')) {
      isMatch = await bcrypt.compare(password, agent.password);
    } else {
      isMatch = (agent.password === password);
    }

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password!" });
    }

    res.status(200).json({
      success: true,
      token: agent._id,
      name: agent.name,
      email: agent.email,
      phone: agent.phone,
      designation: agent.designation,
      experience: agent.experience,
      location: agent.location,
      bio: agent.bio,
      photo: agent.photo,
      membershipPlan: agent.membershipPlan || 'free',
      propertyLimit: agent.propertyLimit || 1,
      badgeType: agent.badgeType || 'none',
      role: 'agent',
      message: "Agent login successful"
    });
  } catch (err) {
    console.error("Agent login error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Update Agent Profile
app.put('/api/agents/:email', async (req, res) => {
  try {
    const { name, phone, designation, experience, location, bio, specialization, languages, photo } = req.body;
    
    const updatedAgent = await User.findOneAndUpdate(
      { email: req.params.email, role: 'agent' },
      { 
        name, 
        phone, 
        designation, 
        experience, 
        location, 
        bio, 
        specialization, 
        languages, 
        photo 
      },
      { new: true }
    ).select('-password');

    if (!updatedAgent) {
      return res.status(404).json({ message: "Agent not found in database!" });
    }

    res.status(200).json({ message: "Advisor profile updated successfully!", agent: updatedAgent });
  } catch (err) {
    console.error("Agent update error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get All Agents
app.get('/api/agents', async (req, res) => {
  try {
    const agents = await User.find({ role: 'agent' }).select('-password').sort({ createdAt: -1 });
    res.status(200).json(agents);
  } catch (err) {
    console.error("Error fetching agents:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get Single Agent
app.get('/api/agents/:id', async (req, res) => {
  try {
    let agent;
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      agent = await User.findById(req.params.id).select('-password');
    } else {
      agent = await User.findOne({ email: req.params.id, role: 'agent' }).select('-password');
    }

    if (!agent) return res.status(404).json({ message: 'Agent not found' });
    res.status(200).json(agent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add Review to Agent
app.post('/api/agents/:id/reviews', async (req, res) => {
  try {
    const { name, rating, comment } = req.body;
    let agent;
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      agent = await User.findById(req.params.id);
    } else {
      agent = await User.findOne({ email: req.params.id });
    }

    if (!agent) return res.status(404).json({ message: 'Agent not found' });

    agent.reviews.unshift({ name, rating, comment });
    await agent.save();

    res.status(201).json({ message: 'Review added successfully', reviews: agent.reviews });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Agent + Agent's Properties + All Related Bookings
app.delete('/api/agents/:id', async (req, res) => {
  try {
    const agentId = req.params.id;
    const agent = await User.findById(agentId);
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    const agentProperties = await Property.find({
      $or: [{ agentEmail: agent.email }, { agentName: agent.name }]
    });

    const propertyIds = agentProperties.map(p => p._id);
    const propertyTitles = agentProperties.map(p => p.title);

    await Booking.deleteMany({
      $or: [
        { propertyId: { $in: propertyIds } },
        { propertyTitle: { $in: propertyTitles } },
        { agentEmail: agent.email },
        { agentName: agent.name }
      ]
    });

    await Property.deleteMany({
      $or: [{ agentEmail: agent.email }, { agentName: agent.name }]
    });

    await User.findByIdAndDelete(agentId);

    res.status(200).json({ message: 'Agent, properties, and bookings deleted successfully' });
  } catch (err) {
    console.error("Error deleting agent:", err);
    res.status(500).json({ error: err.message });
  }
});

// --- CLIENT USER MANAGEMENT ---

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await Booking.deleteMany({ userEmail: user.email });
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Client account and bookings permanently deleted!" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: err.message });
  }
});

// --- PROPERTY ROUTES ---

app.get('/api/properties', async (req, res) => {
  try {
    const properties = await Property.find().sort({ createdAt: -1 });
    res.status(200).json(properties);
  } catch (err) {
    console.error("Error fetching properties:", err);
    res.status(500).json({ error: err.message });
  }
});

// Property Upload with Subscription Limit Checks
app.post('/api/properties', upload.array('images', 5), async (req, res) => {
  try {
    const { title, price, location, beds, baths, sqft, description, agentEmail, agentName } = req.body;
    const imagePaths = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    let finalAgentName = 'Admin';
    if (agentEmail && agentEmail !== 'admin@gmail.com' && agentEmail !== 'admin@rumh.com') {
      finalAgentName = agentName || 'Authorized Agent';

      const agent = await User.findOne({ email: agentEmail });
      if (agent && agent.role === 'agent') {
        const existingCount = await Property.countDocuments({ agentEmail: agent.email });

        if (agent.membershipPlan === 'free' && existingCount >= 1) {
          return res.status(403).json({ message: 'Free Plan limit reached! You can only upload 1 property. Please upgrade your plan.' });
        }
        if (agent.membershipPlan === 'standard' && existingCount >= 5) {
          return res.status(403).json({ message: 'Standard Plan limit reached! You can only upload up to 5 properties. Please upgrade to Premium.' });
        }
      }
    }

    const newProperty = new Property({
      title,
      price,
      location,
      beds,
      baths,
      sqft,
      description,
      agentEmail: agentEmail || 'admin@gmail.com',
      agentName: finalAgentName,
      image: imagePaths[0] || '',
      images: imagePaths
    });

    await newProperty.save();
    res.status(201).json({ message: 'Property created successfully', property: newProperty });
  } catch (err) {
    console.error("Error saving property:", err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/properties/:id', async (req, res) => {
  try {
    const updatedProperty = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProperty) return res.status(404).json({ message: 'Property not found' });
    res.status(200).json({ message: 'Property updated successfully', property: updatedProperty });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/properties/:id', async (req, res) => {
  try {
    const propertyId = req.params.id;
    const property = await Property.findById(propertyId);

    if (!property) return res.status(404).json({ message: 'Property not found' });

    await Booking.deleteMany({
      $or: [
        { propertyId: property._id },
        { propertyTitle: property.title }
      ]
    });

    await Property.findByIdAndDelete(propertyId);
    res.status(200).json({ message: 'Property and associated bookings deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- BOOKING ROUTES ---

app.post('/api/bookings', async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    await newBooking.save();
    res.status(201).json({ message: 'Viewing booked successfully', booking: newBooking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/bookings/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.status(200).json({ message: 'Booking status updated', booking: updatedBooking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/bookings/:id', async (req, res) => {
  try {
    const deletedBooking = await Booking.findByIdAndDelete(req.params.id);
    if (!deletedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json({ message: 'Booking deleted permanently' });
  } catch (err) {
    console.error("Error deleting booking:", err);
    res.status(500).json({ error: err.message });
  }
});

// --- CONTACT INQUIRY ROUTES ---

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, interest, message } = req.body;
    const newInquiry = new Contact({ name, email, phone, interest, message });
    await newInquiry.save();
    res.status(201).json({ message: 'Inquiry submitted successfully!', inquiry: newInquiry });
  } catch (err) {
    console.error("Contact inquiry save error:", err);
    res.status(500).json({ message: 'Failed to submit inquiry', error: err.message });
  }
});

app.get('/api/contact', async (req, res) => {
  try {
    const inquiries = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(inquiries);
  } catch (err) {
    console.error("Error fetching inquiries:", err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/contact/:id', async (req, res) => {
  try {
    const deleted = await Contact.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Inquiry not found' });
    res.status(200).json({ message: 'Inquiry deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- NEWSLETTER ROUTES ---

app.post('/api/newsletter', async (req, res) => {
  try {
    const { email } = req.body;
    const existing = await Newsletter.findOne({ email });
    if (existing) return res.status(400).json({ message: 'This email is already subscribed!' });
    const newSub = new Newsletter({ email });
    await newSub.save();
    res.status(201).json({ message: 'Subscribed successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Server error, please try again.' });
  }
});

app.get('/api/newsletter', async (req, res) => {
  try {
    const subscribers = await Newsletter.find().sort({ createdAt: -1 });
    res.status(200).json(subscribers);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/newsletter/:id', async (req, res) => {
  try {
    await Newsletter.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Subscriber removed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// --- USER PROFILE ROUTES ---

app.get('/api/users/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email }).select('-password');
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/users/:email', async (req, res) => {
  try {
    const { name, phone } = req.body;
    const updatedUser = await User.findOneAndUpdate(
      { email: req.params.email },
      { name, phone },
      { new: true }
    );
    res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Agent Subscription Plan
app.put('/api/agents/plan/:identifier', async (req, res) => {
  try {
    const { membershipPlan, propertyLimit, badgeType } = req.body;
    const identifier = req.params.identifier;
    
    const updatedAgent = await User.findOneAndUpdate(
      { 
        $or: [
          { email: identifier }, 
          { _id: mongoose.Types.ObjectId.isValid(identifier) ? identifier : null }
        ], 
        role: 'agent' 
      },
      { membershipPlan, propertyLimit, badgeType },
      { new: true }
    ).select('-password');

    if (!updatedAgent) {
      return res.status(404).json({ message: "Agent not found in database!" });
    }

    res.status(200).json({ message: "Subscription plan updated successfully!", agent: updatedAgent });
  } catch (err) {
    console.error("Plan update error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/payment/create-order', async (req, res) => {
  try {
    const { amount, planType } = req.body;
    
    res.status(200).json({
      id: "order_" + Math.random().toString(36).substring(7),
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${planType}_1`
    });
  } catch (err) {
    console.error("Payment order error:", err);
    res.status(500).json({ error: 'Failed to create payment order' });
  }
});

const authRoutes = require('./auth.routes');
app.use('/api/auth', authRoutes);

// --- STATIC ASSETS & REACT SPA FALLBACK CONFIGURATION ---

let distPath = path.resolve(__dirname, '../client/dist');
if (!fs.existsSync(distPath)) {
  distPath = path.resolve(__dirname, 'client/dist');
}
if (!fs.existsSync(distPath)) {
  distPath = path.resolve(__dirname, 'dist');
}

console.log("Serving static frontend from:", distPath);
app.use(express.static(distPath));

app.use((req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
    return next();
  }
  if (req.method !== 'GET') {
    return next();
  }

  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }

  res.status(500).send("Frontend build index.html not found! Verify Render build command: npm install && npm run build");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});