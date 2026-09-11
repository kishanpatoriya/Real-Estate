import React, { useState } from 'react';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import axios from 'axios';
import logoImage from '../assets/logo.png';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      await axios.post('https://real-estate-1azb.onrender.com/api/newsletter', { email });
      alert('Subscribed successfully!');
      setEmail('');
    } catch (err) {
      alert(err.response?.data?.message || 'Subscription failed or already subscribed.');
    }
  };

  return (
    <footer className="bg-[#070A0F] border-t border-white/10 text-slate-300 pt-20 pb-10 px-6 lg:px-12 font-sans selection:bg-amber-400 selection:text-slate-950">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        
        {/* Brand Info with Logo */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img 
              src={logoImage} 
              alt="GharSetu Logo" 
              className="h-10 w-auto object-contain brightness-110 drop-shadow-[0_2px_12px_rgba(245,158,11,0.3)]" 
            />
            <div className="flex flex-col">
              <span className="text-xl font-serif tracking-wider text-white font-normal leading-none">
                GHAR<span className="text-amber-400 italic font-sans font-bold ml-0.5">SETU</span>
              </span>
              <span className="text-[8px] font-extrabold uppercase tracking-[0.25em] text-amber-500/80 mt-1">
                Private Luxury Estates
              </span>
            </div>
          </div>
          
          <p className="text-slate-400 text-xs leading-relaxed font-light">
            Premier destination for prime luxury real estate, oceanfront estates, and private architectural acquisitions.
          </p>
          
          <div className="flex items-center gap-2.5 text-slate-300 text-xs pt-2">
            <MapPin size={15} className="text-amber-400 shrink-0" />
            <span>Jamnagar & Ahmedabad, Gujarat, India</span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-serif tracking-wider mb-5 text-sm font-normal uppercase">Portals</h4>
          <ul className="space-y-3 text-xs text-slate-400 font-medium">
            <li><a href="/" className="hover:text-amber-400 transition-colors">Home Experience</a></li>
            <li><a href="/properties" className="hover:text-amber-400 transition-colors">Luxury Estates</a></li>
            <li><a href="/agents" className="hover:text-amber-400 transition-colors">Private Advisors</a></li>
            <li><a href="/about" className="hover:text-amber-400 transition-colors">Heritage & Trust</a></li>
            <li><a href="/contact" className="hover:text-amber-400 transition-colors">Private Inquiries</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-white font-serif tracking-wider mb-5 text-sm font-normal uppercase">Concierge</h4>
          <ul className="space-y-3.5 text-xs text-slate-400 font-medium">
            <li className="flex items-center gap-3">
              <Phone size={15} className="text-amber-400 shrink-0" />
              <span>+91 98765 43210</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={15} className="text-amber-400 shrink-0" />
              <span>concierge@gharsetu.com</span>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-white font-serif tracking-wider mb-5 text-sm font-normal uppercase">Private Dispatch</h4>
          <p className="text-xs text-slate-400 mb-4 font-light leading-relaxed">
            Receive discreet off-market property alerts and private investment insights.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col gap-2.5">
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter client email address" 
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-all font-medium" 
            />
            <button 
              type="submit" 
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-4 py-3 rounded-xl text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              Subscribe <ArrowRight size={14} />
            </button>
          </form>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center text-[11px] text-slate-500">
        <div>
          © {new Date().getFullYear()} GharSetu Private Limited. All rights reserved.
        </div>
        <div className="flex gap-6 text-[11px] text-slate-500">
          <a href="/terms" className="hover:text-slate-400 transition">Terms of Protocol</a>
          <a href="/privacy" className="hover:text-slate-400 transition">Privacy & Discretion Policy</a>
        </div>
      </div>
    </footer>
  );
}