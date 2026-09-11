import React, { useState } from 'react';
import axios from 'axios';
import { Mail, Phone, MapPin, Send, ShieldCheck } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interest: 'Prime Villa Acquisition',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const numericValue = value.replace(/\D/g, '');
      if (numericValue.length <= 10) {
        setFormData({ ...formData, [name]: numericValue });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }

    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = 'Full name is required.';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      tempErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(formData.email)) {
      tempErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.phone.trim()) {
      tempErrors.phone = 'Phone number is required.';
    } else if (formData.phone.length !== 10) {
      tempErrors.phone = 'Phone number must be exactly 10 digits.';
    }

    if (!formData.message.trim()) {
      tempErrors.message = 'Message criteria is required.';
    } else if (formData.message.trim().length < 10) {
      tempErrors.message = 'Message must be at least 10 characters long.';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true);
      try {
        // 👉 Backend API call to save inquiry
        await axios.post('https://real-estate-5-hello.onrender.com/api/contact', formData);
        setSubmitted(true);
      } catch (err) {
        console.error("Error submitting contact inquiry:", err);
        alert(err.response?.data?.message || 'Failed to submit inquiry. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#070A0F] text-slate-100 font-sans selection:bg-amber-400 selection:text-slate-950 flex flex-col justify-between">
      
      <main className="flex-1 pt-40 pb-24 px-6 max-w-7xl mx-auto w-full">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-amber-400 text-[10px] font-extrabold uppercase tracking-[0.25em] bg-black/40 px-4 py-1.5 rounded-full border border-amber-500/30 inline-block mb-6 shadow-sm">
            Direct Concierge Desk
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-light tracking-tight mb-4 text-white">
            Connect With Our <span className="italic font-normal bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 bg-clip-text text-transparent">Advisors</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm md:text-base leading-relaxed font-light">
            Whether inquiring about an off-market estate or scheduling a private viewing, our acquisition partners are available with absolute discretion.
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start mb-20">
          
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-[#0D121D] border border-white/10 p-8 rounded-3xl shadow-2xl">
              <h3 className="text-lg font-serif mb-6 text-white">Direct Desks</h3>
              
              <div className="space-y-6 text-xs font-light">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/5 text-amber-400 rounded-xl flex items-center justify-center shrink-0 border border-white/10">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-200">Flagship Headquarters</p>
                    <p className="text-slate-400 text-[11px] mt-1">Jamnagar & Ahmedabad, Gujarat, India</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/5 text-amber-400 rounded-xl flex items-center justify-center shrink-0 border border-white/10">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-200">Private Line</p>
                    <p className="text-slate-400 text-[11px] mt-1">+91 98765 43210</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/5 text-amber-400 rounded-xl flex items-center justify-center shrink-0 border border-white/10">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-200">Confidential Inquiry</p>
                    <p className="text-slate-400 text-[11px] mt-1">concierge@gharsetu.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#0D121D] border border-white/10 p-6 rounded-3xl flex items-center gap-4 shadow-2xl">
              <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center shrink-0 border border-amber-500/30">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h4 className="text-xs font-serif font-bold text-white mb-0.5">Strict Non-Disclosure</h4>
                <p className="text-[11px] text-slate-400 font-light">All communications are governed under private client NDA protocols.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-[#0D121D] border border-white/10 p-8 md:p-10 rounded-3xl shadow-2xl">
            <h3 className="text-2xl font-serif text-white mb-2">Private Consultation Request</h3>
            <p className="text-slate-400 text-xs mb-8 font-light">Fill out the brief dossier and an acquisitions director will respond within 2 hours.</p>

            {submitted ? (
              <div className="bg-black/40 border border-amber-500/30 text-amber-300 p-8 rounded-2xl text-center space-y-3">
                <h4 className="text-lg font-serif">Inquiry Received with Discretion</h4>
                <p className="text-xs text-slate-400">Thank you, {formData.name}. Our principal advisory desk will reach out shortly.</p>
                <button 
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', phone: '', interest: 'Prime Villa Acquisition', message: '' });
                  }}
                  className="mt-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider cursor-pointer"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 text-xs" noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-2">Full Name</label>
                    <input 
                      type="text" 
                      name="name"
                      placeholder="e.g. Alexander Wright"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full bg-[#070A0F] border ${errors.name ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-400 font-medium`}
                    />
                    {errors.name && <p className="text-red-400 text-[11px] mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-2">Email Address</label>
                    <input 
                      type="email" 
                      name="email"
                      placeholder="client@domain.com"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full bg-[#070A0F] border ${errors.email ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-400 font-medium`}
                    />
                    {errors.email && <p className="text-red-400 text-[11px] mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-2">Phone Number (10 Digits)</label>
                    <input 
                      type="text" 
                      name="phone"
                      placeholder="9876543210"
                      maxLength="10"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full bg-[#070A0F] border ${errors.phone ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-400 font-medium`}
                    />
                    {errors.phone && <p className="text-red-400 text-[11px] mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-2">Area of Interest</label>
                    <select 
                      name="interest"
                      value={formData.interest}
                      onChange={handleChange}
                      className="w-full bg-[#070A0F] border border-white/10 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-amber-400 font-medium cursor-pointer"
                    >
                      <option value="Prime Villa Acquisition">Prime Villa Acquisition</option>
                      <option value="Off-Market Estates">Off-Market Estates</option>
                      <option value="Architectural Curation">Architectural Curation</option>
                      <option value="Legal & Title Advisory">Legal & Title Advisory</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-2">Message / Acquisition Criteria</label>
                  <textarea 
                    name="message"
                    rows="4"
                    placeholder="Specify target locations, budget parameters, and requirements..."
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full bg-[#070A0F] border ${errors.message ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-400 resize-none font-medium`}
                  ></textarea>
                  {errors.message && <p className="text-red-400 text-[11px] mt-1">{errors.message}</p>}
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-3.5 rounded-xl uppercase tracking-widest transition flex items-center justify-center gap-2 shadow-lg cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Submit Confidential Dossier'} <Send size={14} />
                </button>
              </form>
            )}

          </div>

        </div>

      </main>

    </div>
  );
}