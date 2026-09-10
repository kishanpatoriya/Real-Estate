import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, LogOut, Calendar, Building, Clock, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function UserProfile() {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const [visits, setVisits] = useState([]);
  const [agentsList, setAgentsList] = useState([]);
  const [propertiesList, setPropertiesList] = useState([]);

  useEffect(() => {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    const role = sessionStorage.getItem('role') || localStorage.getItem('role');

    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    if (role === 'agent') {
      navigate('/agent-profile', { replace: true });
      return;
    }

    setIsAuthorized(true);

    const currentUserEmail = sessionStorage.getItem('email') || localStorage.getItem('email') || 'client@domain.com';
    const currentUserName = sessionStorage.getItem('name') || localStorage.getItem('name') || 'Registered Client';
    const currentUserPhone = sessionStorage.getItem('phone') || localStorage.getItem('phone') || '+91 98765 43210';

    setUser({
      name: currentUserName,
      email: currentUserEmail,
      phone: currentUserPhone
    });

    fetchAllData(currentUserEmail);
  }, [navigate]);

  const fetchAllData = async (email) => {
    try {
      const [bookingsRes, agentsRes, propsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/bookings'),
        axios.get('http://localhost:5000/api/agents').catch(() => ({ data: [] })),
        axios.get('http://localhost:5000/api/properties').catch(() => ({ data: [] }))
      ]);

      const agentsData = agentsRes.data || [];
      const propsData = propsRes.data || [];

      setAgentsList(agentsData);
      setPropertiesList(propsData);

      // User na email sathe match kariya
      const userBookings = (bookingsRes.data || []).filter(
        b => b.userEmail?.toLowerCase() === email?.toLowerCase()
      );
      setVisits(userBookings);
      setLoadingBookings(false);
    } catch (err) {
      console.error("Error fetching user bookings:", err);
      setLoadingBookings(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    navigate('/login');
  };

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#070A0F] text-slate-100 flex items-center justify-center px-6 py-24 font-sans selection:bg-amber-400 selection:text-slate-950">
      <div className="bg-[#0D121D] border border-white/10 p-8 sm:p-10 rounded-3xl w-full max-w-2xl shadow-2xl">
        
        {/* User Icon & Info */}
        <div className="text-center">
          <div className="w-20 h-20 bg-white/5 text-amber-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-500/30 shadow-xl text-2xl font-serif">
            {user.name ? user.name.charAt(0).toUpperCase() : <User size={34} />}
          </div>

          <h2 className="text-2xl font-serif text-white mb-1">{user.name}</h2>
          <span className="text-[9px] font-extrabold text-amber-300 uppercase tracking-widest bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full inline-block mb-6">
            Private Client Member
          </span>
        </div>

        {/* User Details Box */}
        <div className="space-y-3 text-left text-xs mb-8 font-medium">
          <div className="flex items-center gap-3 p-3.5 bg-black/40 border border-white/5 rounded-2xl">
            <Mail size={16} className="text-amber-400 shrink-0" />
            <div>
              <p className="text-[9px] text-slate-500 uppercase tracking-wider font-bold">Email Address</p>
              <p className="text-slate-200">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 bg-black/40 border border-white/5 rounded-2xl">
            <Phone size={16} className="text-amber-400 shrink-0" />
            <div>
              <p className="text-[9px] text-slate-500 uppercase tracking-wider font-bold">Direct Line</p>
              <p className="text-slate-200">{user.phone}</p>
            </div>
          </div>
        </div>

        {/* Scheduled Property Visits History Section */}
        <div className="mb-8 text-left">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold flex items-center gap-1.5">
              <Calendar size={14} className="text-amber-400" /> Private Walkthrough History
            </p>
            <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-md font-bold">
              {visits.length} Scheduled
            </span>
          </div>

          {loadingBookings ? (
            <p className="text-xs text-slate-500 italic p-4 bg-black/20 rounded-2xl border border-white/5 text-center">
              Loading booking dossier...
            </p>
          ) : visits.length > 0 ? (
            <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
              {visits.map((visit) => {
                // 1. Property match karo (By Property ID or Title)
                const matchedProp = propertiesList.find(p => 
                  p._id === visit.propertyId || 
                  p.title === visit.propertyTitle
                );

                // 2. Jis agent ki property hai tenu real agent profile match karo
                const matchedAgent = agentsList.find(ag => 
                  ag.email === matchedProp?.agentEmail || 
                  ag.name === matchedProp?.agentName || 
                  ag.email === visit.agentEmail || 
                  ag.name === visit.agentName
                );

                const finalAgentName = matchedProp?.agentName || matchedAgent?.name || visit.agentName || 'Listing Advisor';
                const finalAgentPhone = matchedAgent?.phone || '+91 98765 43210';
                const finalAgentEmail = matchedProp?.agentEmail || matchedAgent?.email || visit.agentEmail || 'agent@gharsetu.com';

                return (
                  <div key={visit._id || visit.id} className="p-5 bg-black/40 border border-white/10 hover:border-amber-500/30 transition-all rounded-2xl space-y-3.5 shadow-lg">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
                          <Building size={14} className="text-amber-400 shrink-0" /> 
                          {visit.propertyTitle || matchedProp?.title || 'Luxury Residence'}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-300 font-medium mt-1">
                          <span className="flex items-center gap-1 text-amber-300">
                            <Calendar size={11} className="text-amber-400" /> {visit.date || visit.visitDate}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-amber-300">
                            <Clock size={11} className="text-amber-400" /> {visit.time || visit.visitTime}
                          </span>
                        </div>
                      </div>

                      <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase border shrink-0 ${
                        visit.status === 'Confirmed'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : visit.status === 'Cancelled'
                          ? 'bg-red-500/10 text-red-400 border-red-500/30'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}>
                        {visit.status || 'Pending'}
                      </span>
                    </div>

                    {/* 👉 REAL LISTING AGENT DETAILS BOX */}
                    <div className="bg-[#070A0F] border border-white/5 p-3.5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="space-y-1">
                        <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                          Listing Property Advisor
                        </span>
                        <p className="text-white font-bold flex items-center gap-1.5">
                          <User size={13} className="text-amber-400" /> {finalAgentName}
                        </p>
                        <p className="text-slate-400 text-[11px] flex items-center gap-1.5">
                          <Mail size={12} className="text-slate-500" /> {finalAgentEmail}
                        </p>
                      </div>

                      <a 
                        href={`tel:${finalAgentPhone}`}
                        className="bg-amber-500/10 hover:bg-amber-500 border border-amber-500/30 text-amber-300 hover:text-slate-950 px-3.5 py-2 rounded-xl text-[11px] font-bold transition flex items-center justify-center gap-1.5 shrink-0 self-start sm:self-center cursor-pointer shadow-sm"
                      >
                        <Phone size={12} /> {finalAgentPhone}
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic p-6 bg-black/20 rounded-2xl border border-white/5 text-center">
              No private walkthrough tours scheduled yet.
            </p>
          )}
        </div>

        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className="w-full bg-red-500/10 hover:bg-red-500 text-red-300 hover:text-white font-bold py-3.5 rounded-2xl text-xs uppercase tracking-widest transition flex items-center justify-center gap-2 cursor-pointer border border-red-500/30 shadow-sm"
        >
          <LogOut size={15} /> Logout
        </button>
      </div>
    </div>
  );
}