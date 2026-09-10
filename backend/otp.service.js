const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

const otpStore = {};

async function sendOtp(email) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  otpStore[email] = {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes validity
  };
  
  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'Your Password Reset OTP',
    text: `Your OTP is ${otp}. It expires in 5 minutes.`
  });
}

async function verifyOtp(email, submittedOtp) {
  const record = otpStore[email];
  
  if (!record || record.otp !== submittedOtp || Date.now() > record.expiresAt) {
    return false;
  }
  
  delete otpStore[email]; // OTP use hone ke baad delete ho jayega
  return true;
}

module.exports = { sendOtp, verifyOtp };