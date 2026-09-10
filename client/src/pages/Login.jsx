import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, ArrowRight, ShieldCheck, Building2, KeyRound, CheckCircle2, X } from 'lucide-react';

export default function Login() {
  const [loginType, setLoginType] = useState('user'); // 'user' ya 'agent'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot Password States
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [forgotEmail, setForgotEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalError, setModalError] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = loginType === 'agent' 
        ? 'http://localhost:5000/api/agents/login' 
        : 'http://localhost:5000/api/auth/login';

      const response = await axios.post(endpoint, { email, password });
      
      sessionStorage.clear();
      sessionStorage.setItem('token', response.data.token);
      sessionStorage.setItem('role', loginType);
      sessionStorage.setItem('email', response.data.email || email);
      sessionStorage.setItem('name', response.data.name || (loginType === 'agent' ? 'Authorized Advisor' : 'Client'));
      sessionStorage.setItem('phone', response.data.phone || '+91 98765 43210');

      setLoading(false);
      navigate('/');

    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Invalid email or password!');
    }
  };

  // Forgot Password Flow Handlers
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setModalError('');
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/auth/forgot-password', { email: forgotEmail });
      setLoading(false);
      setForgotStep(2);
      setModalMessage('OTP sent successfully to your registered email.');
    } catch (err) {
      setLoading(false);
      setModalError(err.response?.data?.message || 'Failed to send OTP.');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setModalError('');
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/auth/verify-otp', { email: forgotEmail, otp });
      setLoading(false);
      setForgotStep(3);
      setModalMessage('OTP verified! Enter your new password.');
    } catch (err) {
      setLoading(false);
      setModalError(err.response?.data?.message || 'Invalid or expired OTP.');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setModalError('');
    setLoading(true);
    try {
      // Yahan email aur newPassword dono pass kiye ja rahe hain
      await axios.post('http://localhost:5000/api/auth/reset-password', { 
        email: forgotEmail, 
        newPassword 
      });
      setLoading(false);
      alert('Password reset successfully! Please sign in with your new password.');
      setShowForgotModal(false);
      setForgotStep(1);
      setForgotEmail('');
      setOtp('');
      setNewPassword('');
    } catch (err) {
      setLoading(false);
      setModalError(err.response?.data?.error || err.response?.data?.message || 'Failed to reset password.');
    }
  };

  return (
    <div className="min-h-screen bg-[#070A0F] text-slate-100 flex items-center justify-center px-6 pt-24 pb-12 font-sans selection:bg-amber-400 selection:text-slate-950 relative">
      <div className="bg-[#0D121D] border border-white/10 p-8 sm:p-10 rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden">
        
        {/* Toggle Option: Client or Advisor */}
        <div className="grid grid-cols-2 gap-2 bg-[#070A0F] p-1.5 rounded-2xl mb-8 text-xs font-bold">
          <button 
            type="button"
            onClick={() => { setLoginType('user'); setError(''); }}
            className={`py-2.5 rounded-xl transition uppercase tracking-wider cursor-pointer ${
              loginType === 'user' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Client Login
          </button>
          <button 
            type="button"
            onClick={() => { setLoginType('agent'); setError(''); }}
            className={`py-2.5 rounded-xl transition uppercase tracking-wider cursor-pointer ${
              loginType === 'agent' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Advisor Login
          </button>
        </div>

        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-500/30 shadow-xl">
            {loginType === 'agent' ? <Building2 size={24} /> : <ShieldCheck size={24} />}
          </div>
          <h2 className="text-2xl font-serif text-white mb-1">
            {loginType === 'agent' ? 'Advisor Access' : 'Client Access'}
          </h2>
          <p className="text-slate-400 text-xs font-light">
            {loginType === 'agent' ? 'Enter credentials to manage luxury estate representations' : 'Sign in to review private viewings and portfolio'}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-3.5 rounded-xl text-xs mb-6 font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 font-semibold mb-1.5 uppercase tracking-wider text-[10px]">
              {loginType === 'agent' ? 'Advisor Email' : 'Client Email'}
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 text-slate-500" size={15} />
              <input 
                type="email" 
                required 
                placeholder="client@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#070A0F] border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-400 font-medium"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Password</label>
              <button 
                type="button" 
                onClick={() => { setShowForgotModal(true); setForgotStep(1); setModalError(''); setModalMessage(''); }} 
                className="text-amber-400 hover:underline text-[11px] font-medium cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-slate-500" size={15} />
              <input 
                type="password" 
                required 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#070A0F] border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-400 font-medium"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-3.5 rounded-2xl uppercase tracking-widest transition shadow-xl cursor-pointer flex items-center justify-center gap-2 mt-5"
          >
            {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight size={15} />
          </button>
        </form>

        {loginType === 'user' && (
          <p className="text-center text-xs text-slate-400 mt-8 font-medium">
            Don't have a private account? <Link to="/register" className="text-amber-400 hover:underline">Apply for Access</Link>
          </p>
        )}
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0D121D] border border-white/10 rounded-3xl max-w-md w-full p-8 relative shadow-2xl">
            <button 
              onClick={() => setShowForgotModal(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white bg-white/5 p-2 rounded-full cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-amber-500/30">
                <KeyRound size={20} />
              </div>
              <h3 className="text-xl font-serif text-white">Reset Password</h3>
              <p className="text-slate-400 text-xs mt-1">
                {forgotStep === 1 && "Enter your registered email address to receive an OTP."}
                {forgotStep === 2 && "Enter the 6-digit OTP code sent to your email."}
                {forgotStep === 3 && "Create a secure new password for your account."}
              </p>
            </div>

            {modalError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-3 rounded-xl text-xs mb-4 font-semibold text-center">
                {modalError}
              </div>
            )}
            {modalMessage && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-3 rounded-xl text-xs mb-4 font-semibold text-center">
                {modalMessage}
              </div>
            )}

            {/* Step 1: Email Form */}
            {forgotStep === 1 && (
              <form onSubmit={handleSendOtp} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1.5 uppercase tracking-wider text-[10px]">Email Address</label>
                  <input 
                    type="email" 
                    required 
                    placeholder="client@domain.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full bg-[#070A0F] border border-white/10 rounded-2xl px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-400 font-medium"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded-2xl uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? 'Sending OTP...' : 'Send OTP'} <ArrowRight size={14} />
                </button>
              </form>
            )}

            {/* Step 2: OTP Verification Form */}
            {forgotStep === 2 && (
              <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1.5 uppercase tracking-wider text-[10px]">Enter 6-Digit OTP</label>
                  <input 
                    type="text" 
                    required 
                    maxLength="6"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full bg-[#070A0F] border border-white/10 rounded-2xl px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-400 font-medium tracking-widest text-center text-base"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded-2xl uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? 'Verifying...' : 'Verify OTP'} <CheckCircle2 size={14} />
                </button>
              </form>
            )}

            {/* Step 3: New Password Form */}
            {forgotStep === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1.5 uppercase tracking-wider text-[10px]">New Password</label>
                  <input 
                    type="password" 
                    required 
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-[#070A0F] border border-white/10 rounded-2xl px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-400 font-medium"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded-2xl uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? 'Updating...' : 'Update Password'} <CheckCircle2 size={14} />
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}