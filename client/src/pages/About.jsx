import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Users, 
  Award, 
  ShieldCheck, 
  Globe, 
  Compass, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2 
} from 'lucide-react';

export default function About() {
  const stats = [
    { label: "Total Transactions", value: "$1.2B+" },
    { label: "Curated Estates", value: "350+" },
    { label: "Global Presence", value: "12 Cities" },
    { label: "Client Retention", value: "99.4%" },
  ];

  const team = [
    {
      name: "Marcus Vance",
      role: "Founder & Chief Executive",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
      bio: "Former luxury architectural consultant with 18+ years navigating prime global estate markets."
    },
    {
      name: "Elena Rostova",
      role: "Head of Global Acquisitions",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80",
      bio: "Specializes in high-net-worth portfolio diversification and waterfront residential acquisitions."
    },
    {
      name: "Devon Sinclair",
      role: "Principal Architectural Director",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
      bio: "Award-winning modernist designer reviewing structural uniqueness and craftsmanship for GharSetu."
    }
  ];

  const pillars = [
    {
      icon: <Sparkles className="text-amber-400" size={24} />,
      title: "Unrivaled Architectural Taste",
      desc: "We do not list inventory in bulk. Every residence is hand-selected based on design distinction, privacy, and long-term prestige."
    },
    {
      icon: <ShieldCheck className="text-amber-400" size={24} />,
      title: "Absolute Discretion & Privacy",
      desc: "We serve global figures, entrepreneurs, and discerning families with private off-market deals and strict non-disclosure compliance."
    },
    {
      icon: <Globe className="text-amber-400" size={24} />,
      title: "Global Reach & Local Mastery",
      desc: "Our advisors possess deep on-the-ground intelligence across high-demand coastal regions, metropolitan centers, and private retreats."
    },
    {
      icon: <Award className="text-amber-400" size={24} />,
      title: "End-to-End Concierge Advisory",
      desc: "From initial private viewings and structural audits to legal conveyance, our team manages every nuance seamlessly."
    }
  ];

  return (
    <div className="min-h-screen bg-[#070A0F] text-slate-100 font-sans selection:bg-amber-400 selection:text-slate-950 flex flex-col justify-between">
      
      {/* Hero Header */}
      <section className="relative pt-40 pb-24 px-6 overflow-hidden bg-[#0B0F17] border-b border-white/5">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="text-amber-400 text-[10px] font-extrabold uppercase tracking-[0.25em] bg-black/40 px-4 py-1.5 rounded-full border border-amber-500/30 inline-block mb-6 shadow-sm">
            The GharSetu Legacy
          </span>
          <h1 className="text-4xl md:text-6xl font-serif font-light tracking-tight leading-tight mb-6 text-white">
            Crafting the Standard of <br />
            <span className="italic font-normal bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 bg-clip-text text-transparent">
              Modern Luxury Living.
            </span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-light">
            GharSetu was founded on a singular premise: extraordinary architecture should be matched with an equally refined buying and advisory experience.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          <div className="relative group">
            <div className="relative h-[450px] md:h-[520px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#0D121D]">
              <img 
                src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80" 
                alt="Luxury Estate Architecture" 
                className="w-full h-full object-cover group-hover:scale-105 transition duration-700 brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070A0F] via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 p-5 bg-[#070A0F]/85 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl">
                <p className="text-[10px] text-amber-400 uppercase tracking-widest font-bold mb-1">Architectural Philosophy</p>
                <p className="text-xs text-slate-200 font-serif italic">"A home is not merely an asset; it is the ultimate sanctuary of your life's accomplishments."</p>
              </div>
            </div>
          </div>

          <div>
            <span className="text-amber-400 text-[10px] font-bold uppercase tracking-[0.25em] mb-2 block">Our Origin</span>
            <h2 className="text-3xl md:text-4xl font-serif font-light mb-6 tracking-tight text-white">
              Bridging Visionary Architecture & Global Discretion
            </h2>
            <div className="space-y-4 text-slate-400 text-xs sm:text-sm leading-relaxed font-light">
              <p>
                Founded with a global footprint, GharSetu emerged to serve individuals who view residential living as an art form. Traditional real estate brokerage models frequently prioritize volume over refinement. We reversed this equation.
              </p>
              <p>
                Every estate represented by GharSetu undergoes a detailed structural, environmental, and design audit. We curate exclusively for high-caliber aesthetics, superior build quality, and prime geographic positioning.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/10 text-xs font-semibold text-slate-300">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-amber-400 shrink-0" />
                <span>Pre-Vetted Legal Titles</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-amber-400 shrink-0" />
                <span>Private Off-Market Portfolios</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-amber-400 shrink-0" />
                <span>Architectural Verification</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-amber-400 shrink-0" />
                <span>VIP Private Walkthroughs</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Numbers & Stats Section */}
      <section className="bg-[#0B0F17] py-16 px-6 border-y border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((item, idx) => (
            <div key={idx} className="p-4">
              <h3 className="text-3xl md:text-5xl font-serif text-amber-300 mb-2 font-light">{item.value}</h3>
              <p className="text-slate-400 text-[10px] uppercase tracking-[0.2em] font-semibold">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4 Pillars */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-amber-400 text-[10px] font-bold uppercase tracking-[0.25em] block mb-2">Core Principles</span>
          <h2 className="text-3xl sm:text-4xl font-serif font-light text-white mb-3">The GharSetu Standard</h2>
          <p className="text-slate-400 text-xs sm:text-sm">How we elevate every facet of your luxury acquisition journey.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pillars.map((pillar, index) => (
            <div 
              key={index}
              className="bg-[#0D121D] border border-white/10 p-8 rounded-3xl shadow-xl hover:border-amber-500/40 transition duration-300 group"
            >
              <div className="w-12 h-12 bg-amber-400/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition duration-300 border border-amber-500/20">
                {pillar.icon}
              </div>
              <h3 className="text-lg font-serif text-white mb-2 group-hover:text-amber-300 transition">{pillar.title}</h3>
              <p className="text-slate-400 text-xs leading-relaxed font-light">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Leadership Section */}
      <section className="bg-[#0B0F17] text-white py-24 px-6 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-amber-400 text-[10px] font-bold uppercase tracking-[0.25em] block mb-2">Leadership</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-light mb-3">Meet the Curators</h2>
            <p className="text-slate-400 text-xs sm:text-sm">Guided by veteran architectural analysts and private market brokers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div 
                key={index}
                className="bg-[#0D121D] rounded-3xl overflow-hidden border border-white/10 hover:border-amber-500/40 transition duration-300 shadow-2xl"
              >
                <div className="h-72 overflow-hidden relative bg-slate-900">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D121D] via-transparent to-transparent"></div>
                </div>
                <div className="p-7">
                  <h4 className="text-base font-serif text-white mb-0.5">{member.name}</h4>
                  <p className="text-amber-400 text-[10px] font-bold uppercase tracking-widest mb-3">{member.role}</p>
                  <p className="text-slate-400 text-xs leading-relaxed font-light">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 max-w-4xl mx-auto w-full text-center">
        <div className="bg-[#0D121D] border border-white/10 p-10 md:p-14 rounded-3xl relative overflow-hidden shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-serif font-light text-white mb-4">Ready to Acquire Your Next Landmark?</h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto mb-8 font-light">
            Connect privately with our principal acquisitions desk to schedule confidential estate viewings.
          </p>
          <Link 
            to="/contact"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-8 py-3.5 rounded-xl text-xs uppercase tracking-widest transition shadow-lg"
          >
            Private Consultation <ArrowRight size={14} />
          </Link>
        </div>
      </section>

    </div>
  );
}