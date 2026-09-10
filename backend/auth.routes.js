const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const { sendOtp, verifyOtp } = require('./otp.service');

// Step 1: Request OTP
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'No account with that email' });

    await sendOtp(email);
    res.json({ message: 'OTP sent to email successfully' });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// Step 2: Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const valid = await verifyOtp(email, otp);
    if (!valid) return res.status(400).json({ error: 'Invalid or expired OTP' });

    const resetToken = jwt.sign({ email }, process.env.JWT_RESET_SECRET || 'some_long_random_string', { expiresIn: '10m' });
    res.json({ resetToken, message: 'OTP verified successfully' });
  } catch (err) {
    console.error("OTP verification error:", err);
    res.status(500).json({ error: 'Verification failed' });
  }
});

// Step 3: Reset Password (Updated to accept direct email or token)
router.post('/reset-password', async (req, res) => {
  const { email, newPassword, resetToken } = req.body;

  try {
    let targetEmail = email;

    // Agar token bheja gaya hai toh use decode karke email nikal lo
    if (resetToken) {
      const decoded = jwt.verify(resetToken, process.env.JWT_RESET_SECRET || 'some_long_random_string');
      targetEmail = decoded.email;
    }

    if (!targetEmail) {
      return res.status(400).json({ error: 'Email is required for password reset' });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    const updatedUser = await User.findOneAndUpdate({ email: targetEmail }, { password: hashed });

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(400).json({ error: 'Invalid or expired token/email' });
  }
});

module.exports = router;