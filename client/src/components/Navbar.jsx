import React, { useState, useEffect } from 'react';
import { Menu, X, User, LogIn, LogOut, Sparkles } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import logoImage from '../assets/logo.png';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const name = sessionStorage.getItem('name');
    const role = sessionStorage.getItem('role');

    if (token) {
      setIsLoggedIn(true);
      setUserName(name || 'Client');
      setUserRole(role || 'user');
    } else {
      setIsLoggedIn(false);
      setUserName('');
      setUserRole('');
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    setIsLoggedIn(false);
    setUserName('');
    setUserRole('');
    setIsOpen(false);
    navigate('/login');
  };

  const navLinkStyle = ({ isActive }) =>
    isActive
      ? "text-amber-400 font-extrabold tracking-widest text-[11px] uppercase transition-all duration-300 drop-shadow-[0_2px_10px_rgba(245,158,11,0.35)] flex items-center gap-1"
      : "text-slate-300 hover:text-amber-300 font-medium tracking-widest text-[11px] uppercase transition-all duration-300 flex items-center gap-1";

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled
        ? 'bg-[#0B0F17]/95 backdrop-blur-xl border-b border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] py-3'
        : 'bg-gradient-to-b from-[#0B0F17]/90 to-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
        
        <Link to="/" className="flex items-center gap-3 group">
          <img 
            src={logoImage} 
            alt="GharSetu Logo" 
            className="h-10 w-auto object-contain brightness-110 drop-shadow-[0_2px_12px_rgba(245,158,11,0.3)]" 
          />
          <div className="flex flex-col">
            <span className="text-xl font-serif tracking-wider text-white font-normal leading-none group-hover:text-amber-400 transition-colors">
              GHAR<span className="text-amber-400 italic font-sans font-bold ml-0.5">SETU</span>
            </span>
            <span className="text-[8px] font-extrabold uppercase tracking-[0.25em] text-amber-500/80 mt-1">
              Private Luxury Estates
            </span>
          </div>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          <NavLink to="/" end className={navLinkStyle}>Home</NavLink>
          <NavLink to="/properties" className={navLinkStyle}>Properties</NavLink>  
          <NavLink to="/agents" className={navLinkStyle}>Agents</NavLink>
          
          {(!isLoggedIn || userRole === 'agent') && (
            <NavLink to="/agent-plans" className={navLinkStyle}>
              <Sparkles size={12} /> Plans
            </NavLink>
          )}

          <NavLink to="/about" className={navLinkStyle}>About</NavLink>
          <NavLink to="/services" className={navLinkStyle}>Services</NavLink>
          <NavLink to="/contact" className={navLinkStyle}>Contact</NavLink>
          {userRole === 'admin' && (
            <NavLink to="/admin" className={navLinkStyle}>Admin Suite</NavLink>
          )}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <Link 
                to={userRole === 'agent' ? '/agent-profile' : '/user-profile'}
                className="bg-white/5 hover:bg-white/10 border border-amber-500/30 text-amber-200 px-4 py-2 rounded-xl text-xs font-semibold tracking-wider transition-all flex items-center gap-2 shadow-inner"
              >
                <User size={13} className="text-amber-400" /> {userName}
              </Link>
              <button 
                onClick={handleLogout}
                className="bg-red-500/20 hover:bg-red-500 border border-red-500/30 text-red-300 hover:text-white px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wider transition-all cursor-pointer"
              >
                <LogOut size={13} />
              </button>
            </div>
          ) : (
            <Link 
              to="/login"
              className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-[0_4px_20px_rgba(245,158,11,0.35)] flex items-center gap-2 hover:scale-[1.02]"
            >
              <LogIn size={14} /> Client Portal
            </Link>
          )}
        </div>

        <div className="lg:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-slate-200 hover:text-amber-400 transition p-2">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#0B0F17]/98 border-b border-white/10 px-8 py-8 flex flex-col space-y-5 lg:hidden shadow-2xl backdrop-blur-2xl">
          <NavLink to="/" end onClick={() => setIsOpen(false)} className={navLinkStyle}>Home</NavLink>
          <NavLink to="/properties" onClick={() => setIsOpen(false)} className={navLinkStyle}>Properties</NavLink>
          <NavLink to="/agents" onClick={() => setIsOpen(false)} className={navLinkStyle}>Agents</NavLink>
          
          {(!isLoggedIn || userRole === 'agent') && (
            <NavLink to="/agent-plans" onClick={() => setIsOpen(false)} className={navLinkStyle}>
              <Sparkles size={12} /> Plans & Pricing
            </NavLink>
          )}

          <NavLink to="/about" onClick={() => setIsOpen(false)} className={navLinkStyle}>About</NavLink>
          <NavLink to="/services" onClick={() => setIsOpen(false)} className={navLinkStyle}>Services</NavLink>
          <NavLink to="/contact" onClick={() => setIsOpen(false)} className={navLinkStyle}>Contact</NavLink>
          {userRole === 'admin' && (
            <NavLink to="/admin" onClick={() => setIsOpen(false)} className={navLinkStyle}>Admin Suite</NavLink>
          )}
          
          <div className="pt-4 border-t border-white/10">
            {isLoggedIn ? (
              <div className="space-y-3">
                <Link 
                  to={userRole === 'agent' ? '/agent-profile' : '/user-profile'}
                  onClick={() => setIsOpen(false)}
                  className="w-full bg-white/5 border border-amber-500/30 text-amber-200 text-center py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
                >
                  <User size={14} className="text-amber-400" /> {userName} Profile
                </Link>
                <button 
                  onClick={handleLogout}
                  className="w-full bg-red-500/20 text-red-300 text-center py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
                >
                  <LogOut size={14} /> Log Out
                </button>
              </div>
            ) : (
              <Link 
                to="/login"
                onClick={() => setIsOpen(false)}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-center py-3 rounded-xl text-xs font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg"
              >
                <LogIn size={14} /> Client Portal
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}