import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, User, Phone, MapPin, ArrowRight, ShieldCheck, Building2 } from 'lucide-react';

export default function Register() {
  const [registerType, setRegisterType] = useState('user'); // 'user' ya 'agent'
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    designation: 'Senior Luxury Specialist',
    experience: '1-3 Years',
    location: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = registerType === 'agent'
        ? 'http://localhost:5000/api/agents/register'
        : 'http://localhost:5000/api/auth/register';

      const payload = registerType === 'agent'
        ? {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            designation: formData.designation,
            experience: formData.experience,
            location: formData.location
          }
        : {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password
          };

      await axios.post(endpoint, payload);

      setLoading(false);
      alert(`${registerType === 'agent' ? 'Advisor' : 'Client'} account created successfully! Please sign in.`);
      navigate('/login');
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#070A0F] text-slate-100 flex items-center justify-center px-6 py-28 font-sans selection:bg-amber-400 selection:text-slate-950">
      <div className="bg-[#0D121D] border border-white/10 p-8 sm:p-10 rounded-3xl w-full max-w-lg shadow-2xl relative overflow-hidden">
        
        {/* Toggle Switch */}
        <div className="grid grid-cols-2 gap-2 bg-[#070A0F] p-1.5 rounded-2xl mb-8 text-xs font-bold">
          <button 
            type="button"
            onClick={() => { setRegisterType('user'); setError(''); }}
            className={`py-2.5 rounded-xl transition uppercase tracking-wider cursor-pointer ${
              registerType === 'user' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Client Register
          </button>
          <button 
            type="button"
            onClick={() => { setRegisterType('agent'); setError(''); }}
            className={`py-2.5 rounded-xl transition uppercase tracking-wider cursor-pointer ${
              registerType === 'agent' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Advisor Register
          </button>
        </div>

        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-500/30">
            {registerType === 'agent' ? <Building2 size={24} /> : <ShieldCheck size={24} />}
          </div>
          <h2 className="text-2xl font-serif text-white mb-1">
            {registerType === 'agent' ? 'Join as Private Advisor' : 'Create Client Account'}
          </h2>
          <p className="text-slate-400 text-xs font-light">
            {registerType === 'agent' 
              ? 'Register to represent luxury estates and manage client portfolios' 
              : 'Sign up to explore off-market estates and schedule private walkthroughs'}
          </p>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-3 rounded-xl text-xs mb-6 font-semibold text-center">{error}</div>}

        <form onSubmit={handleRegister} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 font-semibold mb-1.5 uppercase tracking-wider text-[10px]">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 text-slate-500" size={15} />
              <input 
                type="text" 
                name="name"
                required 
                placeholder="e.g. Alexander Wright"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-[#070A0F] border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-400 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-semibold mb-1.5 uppercase tracking-wider text-[10px]">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-slate-500" size={15} />
                <input 
                  type="email" 
                  name="email"
                  required 
                  placeholder="client@domain.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-[#070A0F] border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-400 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1.5 uppercase tracking-wider text-[10px]">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-3.5 text-slate-500" size={15} />
                <input 
                  type="text" 
                  name="phone"
                  required 
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-[#070A0F] border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-400 font-medium"
                />
              </div>
            </div>
          </div>

          {registerType === 'agent' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1.5 uppercase tracking-wider text-[10px]">Designation</label>
                  <select 
                    name="designation" 
                    value={formData.designation} 
                    onChange={handleChange}
                    className="w-full bg-[#070A0F] border border-white/10 rounded-2xl px-4 py-3 text-slate-200 focus:outline-none focus:border-amber-400 font-medium cursor-pointer"
                  >
                    <option value="Senior Luxury Specialist">Senior Luxury Specialist</option>
                    <option value="Commercial Advisor">Commercial Advisor</option>
                    <option value="Residential Consultant">Residential Consultant</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1.5 uppercase tracking-wider text-[10px]">Experience</label>
                  <select 
                    name="experience" 
                    value={formData.experience} 
                    onChange={handleChange}
                    className="w-full bg-[#070A0F] border border-white/10 rounded-2xl px-4 py-3 text-slate-200 focus:outline-none focus:border-amber-400 font-medium cursor-pointer"
                  >
                    <option value="1-3 Years">1-3 Years</option>
                    <option value="3-5 Years">3-5 Years</option>
                    <option value="5+ Years">5+ Years</option>
                    <option value="8+ Years">8+ Years</option>
                    <option value="10+ Years">10+ Years</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1.5 uppercase tracking-wider text-[10px]">Operating Hub / Region</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-3.5 text-slate-500" size={15} />
                  <input 
                    type="text" 
                    name="location"
                    required 
                    placeholder="e.g. Jamnagar, Ahmedabad, Mumbai"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full bg-[#070A0F] border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-400 font-medium"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-slate-400 font-semibold mb-1.5 uppercase tracking-wider text-[10px]">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-slate-500" size={15} />
              <input 
                type="password" 
                name="password"
                required 
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-[#070A0F] border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-400 font-medium"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-3.5 rounded-2xl uppercase tracking-widest transition shadow-xl cursor-pointer flex items-center justify-center gap-2 mt-5"
          >
            {loading ? 'Processing Protocol...' : (registerType === 'agent' ? 'Register as Advisor' : 'Create Account')} <ArrowRight size={15} />
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-8 font-medium">
          Already registered? <Link to="/login" className="text-amber-400 hover:underline">Client Sign In</Link>
        </p>

      </div>
    </div>
  );
}