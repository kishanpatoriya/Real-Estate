import React, { useState } from 'react';
import axios from 'axios';
import { Check, ShieldCheck, Sparkles, Award, ArrowRight, X, Smartphone, Monitor } from 'lucide-react';

export default function AgentPlans({ agentEmail, currentPlan, onPlanUpdated }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedPlanDetails, setSelectedPlanDetails] = useState(null);
  const [utrNumber, setUtrNumber] = useState('');

  const handleSelectPlan = (planType, limit, badge, priceInINR) => {
    const targetEmail = agentEmail || sessionStorage.getItem('email') || localStorage.getItem('email');
    
    if (!targetEmail) {
      setMessage('Error: Advisor email not found. Please log in again.');
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
      setLoading(true);
      const response = await axios.put(`https://real-estate-1azb.onrender.com/api/agents/plan/${targetEmail}`, {
        membershipPlan: planType,
        propertyLimit: limit,
        badgeType: badge,
        utrNumber: utrNumber,
        paymentStatus: 'Verification Pending'
      });
      
      setLoading(false);
      setShowModal(false);
      setMessage(`Payment reference submitted for ₹${priceInINR}! Your plan will be active once reviewed.`);
      if (onPlanUpdated) onPlanUpdated(response.data.agent);
    } catch (err) {
      setLoading(false);
      setMessage(err.response?.data?.message || 'Failed to submit payment reference.');
    }
  };

  const updatePlanInBackend = async (email, planType, limit, badge) => {
    try {
      setLoading(true);
      const response = await axios.put(`https://real-estate-1azb.onrender.com/api/agents/plan/${email}`, {
        membershipPlan: planType,
        propertyLimit: limit,
        badgeType: badge
      });
      setLoading(false);
      setMessage(`Successfully subscribed to ${planType.toUpperCase()} Plan!`);
      if (onPlanUpdated) onPlanUpdated(response.data.agent);
    } catch (err) {
      setLoading(false);
      setMessage(err.response?.data?.message || 'Failed to update plan.');
    }
  };

  const getUpiUrl = (amount, planName) => {
    return `upi://pay?pa=kishanpatoriya2007@okhdfcbank&pn=GharSetu%20Estates&am=${amount}&cu=INR&tn=${planName}%20Subscription`;
  };

  return (
    <div className="min-h-screen bg-[#070A0F] text-slate-100 px-6 pt-12 pb-20 font-sans selection:bg-amber-400 selection:text-slate-950 relative">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-16">
          <span className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-amber-400 bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/20 inline-block mb-3">
            Elite Membership Tiers
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-white mb-3">
            Advisor Representation Plans
          </h2>
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
          <div className={`bg-[#0D121D] border ${currentPlan === 'free' ? 'border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.15)]' : 'border-white/10'} rounded-3xl p-8 flex flex-col justify-between shadow-2xl relative transition-all duration-300`}>
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
              disabled={loading || currentPlan === 'free'}
              onClick={() => handleSelectPlan('free', 1, 'none', 0)}
              className="w-full py-3.5 rounded-2xl text-xs font-bold uppercase tracking-widest bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition cursor-pointer"
            >
              {currentPlan === 'free' ? 'Current Active Plan' : 'Select Free'}
            </button>
          </div>

          {/* Plan 2: Standard */}
          <div className={`bg-[#0D121D] border ${currentPlan === 'standard' ? 'border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.2)]' : 'border-amber-500/30'} rounded-3xl p-8 flex flex-col justify-between shadow-2xl relative transition-all duration-300`}>
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
              disabled={loading || currentPlan === 'standard'}
              onClick={() => handleSelectPlan('standard', 5, 'yellow', 2999)}
              className="w-full py-3.5 rounded-2xl text-xs font-bold uppercase tracking-widest bg-amber-500 hover:bg-amber-400 text-slate-950 transition cursor-pointer shadow-lg"
            >
              {currentPlan === 'standard' ? 'Current Active Plan' : 'Pay ₹2,999 via UPI'}
            </button>
          </div>

          {/* Plan 3: Premium */}
          <div className={`bg-[#0D121D] border ${currentPlan === 'premium' ? 'border-amber-400 shadow-[0_0_40px_rgba(16,185,129,0.2)]' : 'border-emerald-500/40'} rounded-3xl p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden transition-all duration-300`}>
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
              disabled={loading || currentPlan === 'premium'}
              onClick={() => handleSelectPlan('premium', 999999, 'green', 7999)}
              className="w-full py-3.5 rounded-2xl text-xs font-bold uppercase tracking-widest bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 transition cursor-pointer shadow-xl"
            >
              {currentPlan === 'premium' ? 'Current Active Plan' : 'Pay ₹7,999 via UPI'}
            </button>
          </div>

        </div>

      </div>

      {/* --- PAYMENT MODAL WITH UTR FIELD --- */}
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

            {/* Desktop View QR with proper URL encoding for embedded amount */}
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