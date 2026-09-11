import React, { useState, useEffect } from 'react';
import { MapPin, Bed, Bath, Square, ArrowRight, ShieldCheck, Award, Users, Star, Sparkles, CheckCircle2, Compass, Check, Smartphone, Monitor, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Home() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states for direct on-page plan selection & payment
  const [showModal, setShowModal] = useState(false);
  const [selectedPlanDetails, setSelectedPlanDetails] = useState(null);
  const [utrNumber, setUtrNumber] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeaturedProperties();
  }, []);

  const fetchFeaturedProperties = async () => {
    try {
      const response = await axios.get('https://real-estate-5-hello.onrender.com/api/properties');
      setProperties(response.data.slice(0, 3));
      setLoading(false);
    } catch (err) {
      console.error("Error fetching properties for home page:", err);
      setLoading(false);
    }
  };

  const handleSelectPlan = (planType, limit, badge, priceInINR) => {
    const targetEmail = sessionStorage.getItem('email') || localStorage.getItem('email');
    
    if (!targetEmail) {
      alert('Please log in as an Advisor first to select a representation plan.');
      navigate('/login');
      return;
    }

    if (planType === 'free' || priceInINR === 0) {
      updatePlanInBackend(targetEmail, planType, limit, badge);
      return;
    }

    setSelectedPlanDetails({ planType, limit, badge, priceInINR, targetEmail });
    setUtrNumber('');
    setShowModal(true);
  };

  const handleVerifyUtr = async () => {
    if (!utrNumber || utrNumber.length < 10) {
      alert('Please enter a valid 12-digit UPI Reference (UTR) Number after making the payment.');
      return;
    }

    const { targetEmail, planType, limit, badge, priceInINR } = selectedPlanDetails;
    
    try {
      const response = await axios.put(`https://real-estate-5-hello.onrender.com/api/agents/plan/${targetEmail}`, {
        membershipPlan: planType,
        propertyLimit: limit,
        badgeType: badge,
        utrNumber: utrNumber,
        paymentStatus: 'Verification Pending'
      });
      
      setShowModal(false);
      setMessage(`Payment reference submitted for ₹${priceInINR}! Your plan will be active once reviewed by admin.`);
      alert(`Payment reference submitted successfully for ${planType.toUpperCase()} Plan!`);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit payment reference.');
    }
  };

  const updatePlanInBackend = async (email, planType, limit, badge) => {
    try {
      const response = await axios.put(`https://real-estate-5-hello.onrender.com/api/agents/plan/${email}`, {
        membershipPlan: planType,
        propertyLimit: limit,
        badgeType: badge
      });
      alert(`Successfully subscribed to ${planType.toUpperCase()} Plan!`);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update plan.');
    }
  };

  const getUpiUrl = (amount, planName) => {
    return `upi://pay?pa=kishanpatoriya2007@okhdfcbank&pn=GharSetu%20Estates&am=${amount}&cu=INR&tn=${planName}%20Subscription`;
  };

  const testimonials = [
    {
      id: 1,
      name: "Alexander Wright",
      role: "Global Tech Founder",
      comment: "GharSetu handles luxury acquisitions with unmatched discretion and architectural depth. Truly elite service.",
      rating: 5
    },
    {
      id: 2,
      name: "Sophia Sterling",
      role: "Private Equity Principal",
      comment: "The rigorous legal verification and direct guidance from certified specialists made acquiring our villa seamless.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-[#070A0F] text-slate-100 font-sans selection:bg-amber-400 selection:text-slate-950 relative">
      
      {/* ===================== 1. ARCHITECTURAL 100VH HERO ===================== */}
      <section className="relative h-screen w-full flex items-center justify-center px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=90" 
            alt="Signature Villa" 
            className="w-full h-full object-cover brightness-[0.7] contrast-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070A0F] via-[#070A0F]/45 to-[#070A0F]/70"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto w-full flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 bg-black/50 backdrop-blur-md border border-amber-500/30 px-4 py-1.5 rounded-full text-amber-300 text-[10px] font-extrabold uppercase tracking-[0.25em] mb-7 shadow-2xl">
            <Sparkles size={12} className="text-amber-400" />
            <span>Curated Portfolio 2026 Edition</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif text-white tracking-tight leading-[1.1] mb-6 max-w-4xl drop-shadow-2xl font-light">
            Extraordinary Homes for <br />
            <span className="italic font-normal bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 bg-clip-text text-transparent">
              Unrivaled Lifestyles.
            </span>
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm md:text-base max-w-2xl mb-11 leading-relaxed font-light tracking-wide drop-shadow">
            Specializing in prime architectural estates, oceanfront compounds, and discreet luxury acquisitions across prime locations.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link 
              to="/properties" 
              className="w-full sm:w-auto bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-9 py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_8px_30px_rgba(245,158,11,0.25)] text-xs uppercase tracking-widest cursor-pointer hover:scale-[1.02]"
            >
              Explore Portfolio <ArrowRight size={14} />
            </Link>
            
            <Link 
              to="/agents" 
              className="w-full sm:w-auto bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/15 text-slate-200 hover:text-amber-300 font-semibold px-9 py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-xs uppercase tracking-widest cursor-pointer hover:border-amber-500/40"
            >
              <Compass size={14} /> Private Advisors
            </Link>
          </div>

          <div className="mt-14 flex flex-wrap items-center justify-center gap-8 sm:gap-12 text-slate-400 text-[11px] font-medium tracking-wider pt-6 border-t border-white/10">
            <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-amber-400" /> Title Verified Deeds</div>
            <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-amber-400" /> Certified Private Specialists</div>
            <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-amber-400" /> Direct High-Discretion Escrow</div>
          </div>
        </div>
      </section>

      {/* ===================== 2. STATS BAR ===================== */}
      <section className="border-y border-white/5 bg-[#0B0F17] py-14 px-6 relative">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          <div>
            <h3 className="text-3xl sm:text-4xl font-serif text-amber-300 mb-1 font-light">$500M+</h3>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">Closed Acquisitions</p>
          </div>
          <div>
            <h3 className="text-3xl sm:text-4xl font-serif text-amber-300 mb-1 font-light">1,200+</h3>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">Verified Residences</p>
          </div>
          <div>
            <h3 className="text-3xl sm:text-4xl font-serif text-amber-300 mb-1 font-light">99.2%</h3>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">Discretion Rating</p>
          </div>
          <div>
            <h3 className="text-3xl sm:text-4xl font-serif text-amber-300 mb-1 font-light">45+</h3>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">Elite Market Partners</p>
          </div>
        </div>
      </section>

      {/* ===================== 3. CURATED PROPERTIES ===================== */}
      <section className="py-28 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-white/10 pb-8 gap-4">
          <div>
            <span className="text-amber-400 text-[10px] font-bold uppercase tracking-[0.25em] block mb-2">Bespoke Residences</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-light text-white tracking-tight">Featured Acquisitions</h2>
          </div>
          <Link to="/properties" className="text-amber-400 hover:text-amber-300 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 transition">
            View All Estates <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <p className="text-amber-400 text-xs font-bold uppercase tracking-widest animate-pulse">Loading Collection...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl bg-[#0B0F17]">
            <p className="text-slate-400 text-xs font-medium">No active private listings available currently.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {properties.map((item) => {
              const mainImg = item.images && item.images.length > 0 
                ? (item.images[0].startsWith('http') ? item.images[0] : `https://real-estate-1azb.onrender.com${item.images[0]}`)
                : (item.image && item.image.startsWith('http') ? item.image : `https://real-estate-1azb.onrender.com${item.image}`);

              return (
                <div key={item._id} className="bg-[#0D121D] rounded-2xl overflow-hidden border border-white/10 hover:border-amber-500/40 transition-all duration-500 group flex flex-col justify-between shadow-2xl">
                  <div>
                    <div className="relative h-72 overflow-hidden bg-slate-900">
                      <img src={mainImg} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-700 brightness-90 group-hover:brightness-100" />
                      <span className="absolute top-4 right-4 bg-black/70 backdrop-blur-md text-amber-300 border border-amber-500/30 font-serif text-sm px-3.5 py-1 rounded-lg">
                        ${item.price}M
                      </span>
                    </div>

                    <div className="p-7">
                      <div className="flex items-center gap-1.5 text-amber-400/80 text-[11px] uppercase tracking-wider mb-2 font-semibold">
                        <MapPin size={12} className="text-amber-400" /> {item.location}
                      </div>
                      <h3 className="text-lg font-serif text-white mb-5 group-hover:text-amber-300 transition">{item.title}</h3>
                      
                      <div className="grid grid-cols-3 gap-2 py-3.5 border-y border-white/10 text-center text-xs text-slate-300 font-medium">
                        <span className="flex items-center justify-center gap-1.5"><Bed size={13} className="text-amber-400" /> {item.beds} Beds</span>
                        <span className="border-x border-white/10 flex items-center justify-center gap-1.5"><Bath size={13} className="text-amber-400" /> {item.baths} Baths</span>
                        <span className="flex items-center justify-center gap-1.5"><Square size={13} className="text-amber-400" /> {item.sqft} sqft</span>
                      </div>
                    </div>
                  </div>

                  <div className="px-7 pb-7 pt-2">
                    <Link to={`/properties/${item._id}`} className="w-full bg-white/5 hover:bg-amber-400 text-slate-200 hover:text-slate-950 font-bold py-3.5 rounded-xl transition-all duration-300 text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 border border-white/10 hover:border-transparent">
                      Private Viewings <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ===================== 4. HERITAGE / ADVISORY ===================== */}
      <section className="bg-[#0B0F17] text-white py-28 px-6 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="text-amber-400 text-[10px] font-bold uppercase tracking-[0.25em] block mb-2">The Standard</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-light mb-3">Why Discerning Buyers Choose GharSetu</h2>
            <p className="text-slate-400 text-xs sm:text-sm">We operate beyond transactional listings, creating seamless bespoke real estate partnerships.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#0D121D] p-9 rounded-2xl border border-white/10 hover:border-amber-500/40 transition">
              <div className="w-12 h-12 bg-amber-400/10 text-amber-400 rounded-xl flex items-center justify-center mb-6"><ShieldCheck size={24} /></div>
              <h3 className="text-lg font-serif mb-2 text-white">Full Legal Due Diligence</h3>
              <p className="text-slate-400 text-xs leading-relaxed">Each estate undergoes title searches, zone approvals, and architectural vetting prior to presentation.</p>
            </div>

            <div className="bg-[#0D121D] p-9 rounded-2xl border border-white/10 hover:border-amber-500/40 transition">
              <div className="w-12 h-12 bg-amber-400/10 text-amber-400 rounded-xl flex items-center justify-center mb-6"><Award size={24} /></div>
              <h3 className="text-lg font-serif mb-2 text-white">Dedicated Private Advisors</h3>
              <p className="text-slate-400 text-xs leading-relaxed">Direct representation by vetted luxury real estate specialists who understand elite portfolios.</p>
            </div>

            <div className="bg-[#0D121D] p-9 rounded-2xl border border-white/10 hover:border-amber-500/40 transition">
              <div className="w-12 h-12 bg-amber-400/10 text-amber-400 rounded-xl flex items-center justify-center mb-6"><Users size={24} /></div>
              <h3 className="text-lg font-serif mb-2 text-white">Private Concierge Walkthroughs</h3>
              <p className="text-slate-400 text-xs leading-relaxed">Schedule private, guided executive viewings arranged directly around your personal itinerary.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== 5. CLIENT EXPERIENCES ===================== */}
      <section className="py-28 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-amber-400 text-[10px] font-bold uppercase tracking-[0.25em] block mb-2">Private Feedback</span>
          <h2 className="text-3xl sm:text-4xl font-serif font-light text-white mb-2">Client Testimonials</h2>
          <p className="text-slate-400 text-xs">Reflections from prominent investors and homeowners.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((item) => (
            <div key={item.id} className="bg-[#0D121D] p-9 rounded-2xl border border-white/10 shadow-xl relative">
              <div className="flex gap-1 text-amber-400 mb-5">
                {[...Array(item.rating)].map((_, i) => (<Star key={i} size={15} fill="currentColor" />))}
              </div>
              <p className="text-slate-300 font-serif italic mb-6 text-sm sm:text-base leading-relaxed">"{item.comment}"</p>
              <div>
                <h4 className="font-semibold text-white text-sm">{item.name}</h4>
                <p className="text-[11px] text-amber-400/80 font-medium tracking-wider uppercase mt-0.5">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== 6. ADVISOR REPRESENTATION PLANS (With Direct Modal Trigger) ===================== */}
      <section className="bg-[#0B0F17] py-28 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-amber-400 bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/20 inline-block mb-3">
              Elite Membership Tiers
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-white mb-3">Advisor Representation Plans</h2>
            <p className="text-slate-400 text-xs sm:text-sm font-light max-w-xl mx-auto">
              Choose your preferred tier to expand your luxury real estate portfolio and elevate your professional standing.
            </p>
          </div>

          {message && (
            <div className="max-w-md mx-auto mb-10 p-3.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-center rounded-2xl text-xs font-semibold shadow-xl">
              {message}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Plan 1: Free */}
            <div className="bg-[#0D121D] border border-white/10 rounded-3xl p-8 flex flex-col justify-between shadow-2xl">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Starter</span>
                  <span className="text-xs bg-white/5 border border-white/10 text-slate-300 px-3 py-1 rounded-full font-semibold">Free</span>
                </div>
                <h3 className="text-2xl font-serif text-white mb-2">Basic Tier</h3>
                <p className="text-slate-400 text-xs font-light mb-8">Ideal for getting started with single listings.</p>
                <ul className="space-y-4 text-xs text-slate-300 mb-8 border-t border-white/5 pt-6">
                  <li className="flex items-center gap-3"><Check size={15} className="text-amber-400 shrink-0" /> Only 1 Property Upload Limit</li>
                </ul>
              </div>
              <button 
                onClick={() => handleSelectPlan('free', 1, 'none', 0)}
                className="w-full py-3.5 rounded-2xl text-xs font-bold uppercase tracking-widest bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition cursor-pointer"
              >
                Select Free
              </button>
            </div>

            {/* Plan 2: Standard */}
            <div className="bg-[#0D121D] border border-amber-500/30 rounded-3xl p-8 flex flex-col justify-between shadow-2xl">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-amber-400">Standard</span>
                  <span className="text-xs bg-amber-500/10 text-amber-400 px-3 py-1 rounded-full border border-amber-500/30 font-semibold">₹2,999 / mo</span>
                </div>
                <h3 className="text-2xl font-serif text-white mb-2">Professional</h3>
                <p className="text-slate-400 text-xs font-light mb-8">Enhanced visibility with a yellow elite identity.</p>
                <ul className="space-y-4 text-xs text-slate-300 mb-8 border-t border-white/5 pt-6">
                  <li className="flex items-center gap-3"><Check size={15} className="text-amber-400 shrink-0" /> Up to 5 Property Uploads</li>
                  <li className="flex items-center gap-3 text-amber-400 font-semibold"><Award size={15} className="shrink-0" /> Verified Elite Badge (Yellow)</li>
                </ul>
              </div>
              <button 
                onClick={() => handleSelectPlan('standard', 5, 'yellow', 2999)}
                className="w-full py-3.5 rounded-2xl text-xs font-bold uppercase tracking-widest bg-amber-500 hover:bg-amber-400 text-slate-950 transition cursor-pointer shadow-lg"
              >
                Pay ₹2,999 via UPI
              </button>
            </div>

            {/* Plan 3: Premium */}
            <div className="bg-[#0D121D] border border-emerald-500/40 rounded-3xl p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 text-[9px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-bl-2xl shadow-md">
                Most Popular
              </div>
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-emerald-400">Elite VIP</span>
                  <span className="text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/30 font-semibold">₹7,999 / mo</span>
                </div>
                <h3 className="text-2xl font-serif text-white mb-2">Master Luxury</h3>
                <p className="text-slate-400 text-xs font-light mb-8">Unlimited reach, priority placement, and green elite verification.</p>
                <ul className="space-y-4 text-xs text-slate-300 mb-8 border-t border-white/5 pt-6">
                  <li className="flex items-center gap-3"><Check size={15} className="text-emerald-400 shrink-0" /> Unlimited Property Uploads</li>
                  <li className="flex items-center gap-3 text-emerald-400 font-semibold"><ShieldCheck size={15} className="shrink-0" /> Verified Elite Badge (Green)</li>
                </ul>
              </div>
              <button 
                onClick={() => handleSelectPlan('premium', 999999, 'green', 7999)}
                className="w-full py-3.5 rounded-2xl text-xs font-bold uppercase tracking-widest bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 transition cursor-pointer shadow-xl"
              >
                Pay ₹7,999 via UPI
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- DIRECT UPI PAYMENT MODAL ON HOME PAGE --- */}
      {showModal && selectedPlanDetails && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0D121D] border border-amber-500/40 rounded-3xl p-8 max-w-md w-full shadow-2xl relative text-center">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white cursor-pointer bg-white/5 p-2 rounded-full"
            >
              <X size={16} />
            </button>

            <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30 inline-block mb-3">
              UPI Payment Verification
            </span>
            <h3 className="text-2xl font-serif text-white mb-1">Pay ₹{selectedPlanDetails.priceInINR}</h3>
            <p className="text-slate-400 text-xs mb-5">
              Scan QR or click below to pay to <strong className="text-amber-400">kishanpatoriya2007@okhdfcbank</strong>
            </p>

            {/* Mobile View */}
            <div className="block md:hidden mb-4">
              <a 
                href={getUpiUrl(selectedPlanDetails.priceInINR, selectedPlanDetails.planType)}
                className="w-full bg-amber-500 text-slate-950 font-bold py-3 rounded-2xl text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg"
              >
                <Smartphone size={16} /> Open GPay / Paytm to Pay ₹{selectedPlanDetails.priceInINR}
              </a>
            </div>

            {/* Desktop View QR */}
            <div className="hidden md:block mb-4">
              <div className="bg-white p-3 rounded-2xl inline-block shadow-xl border-4 border-amber-500/20">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(`upi://pay?pa=kishanpatoriya2007@okhdfcbank&pn=GharSetu%20Estates&am=${selectedPlanDetails.priceInINR}&cu=INR&tn=${selectedPlanDetails.planType}%20Subscription`)}`} 
                  alt="Pre-filled QR Code" 
                  className="w-36 h-36 object-contain mx-auto"
                />
              </div>
            </div>

            {/* UTR Input Field */}
            <div className="text-left mb-5">
              <label className="block text-[11px] font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Enter 12-Digit UPI Ref / UTR Number <span className="text-amber-400">*</span>
              </label>
              <input 
                type="text" 
                placeholder="e.g., 4352xxxxxxxx" 
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value)}
                className="w-full bg-[#070A0F] border border-white/10 rounded-xl px-4 py-3 text-xs text-slate-200 focus:border-amber-400 focus:outline-none font-semibold tracking-wider"
              />
              <p className="text-[10px] text-slate-500 mt-1">Payment karne ke baad jo reference/UTR number mile use yahan enter karein.</p>
            </div>

            <button 
              onClick={handleVerifyUtr}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold py-3.5 rounded-2xl text-xs uppercase tracking-widest transition cursor-pointer shadow-lg flex items-center justify-center gap-2"
            >
              Submit UTR & Request Activation <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}