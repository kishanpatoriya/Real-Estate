import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldAlert, Lock, Mail, ArrowRight, Home } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAdminLogin = (e) => {
    e.preventDefault();
    
    if (email === 'admin@gmail.com' && password === 'admin123') {
      // localStorage ki jagah sessionStorage ka use karein
      sessionStorage.setItem('isAdminLoggedIn', 'true');
      navigate('/admin');
    } else {
      setError('Invalid Admin Credentials! Access Denied.');
    }
  };

  return (
    <div className="min-h-screen bg-[#070A0F] text-slate-100 font-sans flex items-center justify-center px-6 selection:bg-amber-400 selection:text-slate-950">
      <div className="w-full max-w-md bg-[#0D121D] border border-white/10 p-9 rounded-3xl shadow-2xl relative overflow-hidden">
        
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-500/30">
            <ShieldAlert size={26} />
          </div>
          <h2 className="text-2xl font-serif text-white mb-1">Executive Portal</h2>
          <p className="text-slate-400 text-xs font-light">Authorized access only for GharSetu Control Center.</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl text-xs font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-5 text-xs">
          <div>
            <label className="block text-slate-400 font-semibold mb-2 uppercase tracking-wider text-[10px]">Admin Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="email" 
                required
                placeholder="admin@gmail.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#070A0F] border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-400 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-2 uppercase tracking-wider text-[10px]">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="password" 
                required
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#070A0F] border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-400 font-medium"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-3.5 rounded-xl uppercase tracking-widest transition flex items-center justify-center gap-2 shadow-lg mt-4 cursor-pointer"
          >
            Authenticate Admin <ArrowRight size={15} />
          </button>
        </form>

        <div className="mt-8 text-center border-t border-white/10 pt-6">
          <Link to="/" className="text-xs text-slate-400 hover:text-amber-400 transition flex items-center justify-center gap-1 font-medium">
            <Home size={14} /> Back to Public Website
          </Link>
        </div>

      </div>
    </div>
  );
}