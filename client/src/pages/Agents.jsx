import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShieldCheck, MapPin, Briefcase, Mail, ArrowRight, UserCheck } from 'lucide-react';

export default function Agents() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const res = await axios.get('https://real-estate-5-hello.onrender.com/api/agents');
      setAgents(res.data);
    } catch (err) {
      console.error("Error fetching agents:", err);
      const localAgents = JSON.parse(localStorage.getItem('rumh_agents')) || [];
      if (localAgents.length > 0) setAgents(localAgents);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070A0F] text-slate-100 px-6 lg:px-16 pt-36 pb-24 font-sans selection:bg-amber-400 selection:text-slate-950">
      <div className="max-w-7xl mx-auto">
        
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-amber-400 text-[10px] font-extrabold uppercase tracking-[0.25em] bg-black/40 px-4 py-1.5 rounded-full border border-amber-500/30 inline-flex items-center gap-1.5 mb-3 shadow-sm">
            <UserCheck size={14} className="text-amber-400" /> Private Advisors Desk
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-light tracking-tight text-white">
            Certified Estate Specialists
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-3 font-light leading-relaxed">
            Connect with verified luxury property partners to acquire, sell, or manage private portfolios.
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-24 text-amber-400 text-xs uppercase tracking-widest font-semibold animate-pulse">
            Loading Certified Advisors...
          </div>
        ) : agents.length === 0 ? (
          <div className="text-center py-20 bg-[#0D121D] border border-dashed border-white/10 rounded-3xl p-8 shadow-sm">
            <p className="text-slate-400 font-medium text-xs">No registered advisors found at this time.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {agents.map((agent) => {
              const agentId = agent._id || agent.id || agent.email;
              return (
                <div 
                  key={agentId}
                  onClick={() => navigate(`/agents/${agentId}`)}
                  className="bg-[#0D121D] border border-white/10 rounded-3xl p-7 shadow-2xl hover:border-amber-500/40 transition-all duration-300 cursor-pointer flex flex-col justify-between group relative overflow-hidden"
                >
                  <div>
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center shrink-0 text-amber-400 text-2xl font-serif">
                        {agent.photo ? (
                          <img src={agent.photo} alt={agent.name} className="w-full h-full object-cover" />
                        ) : (
                          agent.name?.charAt(0)?.toUpperCase() || 'A'
                        )}
                      </div>
                      <div>
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-md mb-1.5 uppercase tracking-wider">
                          <ShieldCheck size={11} /> Certified Partner
                        </span>
                        <h3 className="font-serif text-white text-lg group-hover:text-amber-300 transition">
                          {agent.name}
                        </h3>
                        <p className="text-[11px] text-slate-400 font-medium">{agent.designation || 'Luxury Specialist'}</p>
                      </div>
                    </div>

                    <div className="space-y-2.5 text-xs text-slate-400 border-t border-white/10 pt-4 mb-6 font-light">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-amber-400 shrink-0" />
                        <span>{agent.location || 'Gujarat, India'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Briefcase size={14} className="text-amber-400 shrink-0" />
                        <span>{agent.experience || '5+ Years'} Experience</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail size={14} className="text-amber-400 shrink-0" />
                        <span className="truncate">{agent.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs font-bold text-amber-400 uppercase tracking-wider text-[10px]">
                    <span>View Portfolio & Reviews</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}