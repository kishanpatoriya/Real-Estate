import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Compass, 
  Key, 
  Briefcase, 
  Plane, 
  ArrowRight, 
  CheckCircle2, 
  HelpCircle, 
  Sparkles 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Services() {
  const serviceList = [
    {
      icon: <Building2 className="text-amber-400" size={28} />,
      title: "Prime Estate Acquisition",
      description: "Tailored brokerage services for purchasing landmark villas, penthouses, and historical estates across global prime locations with absolute confidentiality."
    },
    {
      icon: <ShieldCheck className="text-amber-400" size={28} />,
      title: "Legal & Title Verification",
      description: "Rigorous multi-jurisdictional legal audits, structural environmental checks, and secure title deeds conveyance managed by top-tier legal experts."
    },
    {
      icon: <Compass className="text-amber-400" size={28} />,
      title: "Architectural Curation",
      description: "Collaborate with world-renowned interior designers and modernist architects to customize or evaluate your newly acquired luxury space."
    },
    {
      icon: <Briefcase className="text-amber-400" size={28} />,
      title: "High-Net-Worth Portfolio Management",
      description: "Strategic real estate asset diversification, yielding optimal capital growth and tax-efficient portfolio structuring for global investors."
    },
    {
      icon: <Plane className="text-amber-400" size={28} />,
      title: "Private VIP Viewings & Transport",
      description: "Exclusive private chauffeur and helicopter arrangements for confidential, discrete site inspections of off-market luxury residences."
    },
    {
      icon: <Key className="text-amber-400" size={28} />,
      title: "Turnkey Concierge & Relocation",
      description: "Seamless white-glove relocation services, domestic staffing alignment, and immediate property handover administration for elite buyers."
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Private Consultation",
      desc: "An initial discrete meeting with our principal acquisitions desk to define your architectural preferences, financial framework, and location criteria."
    },
    {
      number: "02",
      title: "Curated Portfolio Review",
      desc: "We present a hand-selected catalog of public and confidential off-market estates matching your exact standard of living."
    },
    {
      number: "03",
      title: "VIP Inspections & Audits",
      desc: "Conduct private site visits via secure transport accompanied by structural and environmental engineering analysts."
    },
    {
      number: "04",
      title: "Seamless Conveyance",
      desc: "End-to-end legal title transfers, tax compliance structuring, and white-glove handover of your new landmark property."
    }
  ];

  const faqs = [
    {
      q: "Are all listings publicly visible on the platform?",
      a: "No. Due to strict privacy mandates for high-profile clients, approximately 40% of our ultra-luxury inventory is maintained off-market and shared only following verified private consultation."
    },
    {
      q: "How does the system ensure absolute legal security?",
      a: "Every estate undergoes a rigorous 40-point title check, environmental risk analysis, and international tax compliance review before being presented to clients."
    },
    {
      q: "Can international investors acquire properties seamlessly?",
      a: "Yes. Our legal conveyance team specializes in cross-border acquisitions, golden visas, and multi-jurisdictional asset holding structures."
    }
  ];

  return (
    <div className="min-h-screen bg-[#070A0F] text-slate-100 font-sans selection:bg-amber-400 selection:text-slate-950 flex flex-col justify-between">

      {/* Main Content */}
      <main className="flex-1 pt-40 pb-24 px-6 max-w-7xl mx-auto w-full">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-amber-400 text-[10px] font-extrabold uppercase tracking-[0.25em] bg-black/40 px-4 py-1.5 rounded-full border border-amber-500/30 inline-flex items-center gap-1.5 mb-6 shadow-sm">
            <Sparkles size={12} /> Elite Offerings & Advisory
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-light tracking-tight mb-4 text-white">
            Comprehensive <span className="italic font-normal bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 bg-clip-text text-transparent">Concierge Services</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm md:text-base leading-relaxed font-light">
            We provide an uncompromised suite of specialized real estate services tailored exclusively for high-net-worth investors, luxury homeowners, and authorized partners.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-28">
          {serviceList.map((service, index) => (
            <div 
              key={index}
              className="bg-[#0D121D] border border-white/10 p-8 rounded-3xl hover:border-amber-500/40 transition-all duration-300 group flex flex-col justify-between shadow-2xl"
            >
              <div>
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition duration-300 border border-amber-500/30">
                  {service.icon}
                </div>
                <h3 className="text-xl font-serif text-white mb-3 group-hover:text-amber-300 transition">{service.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed mb-6 font-light">{service.description}</p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center gap-2 text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                <CheckCircle2 size={15} /> Verified Standard
              </div>
            </div>
          ))}
        </div>

        {/* Acquisition Timeline Section */}
        <div className="mb-28 bg-[#0B0F17] border border-white/10 p-10 md:p-14 rounded-3xl shadow-2xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-amber-400 text-[10px] font-bold uppercase tracking-[0.25em] block mb-2">Protocol</span>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-white mb-3">The Estate Acquisition Journey</h2>
            <p className="text-slate-400 text-xs sm:text-sm font-light">A transparent, rigorous, and discreet framework designed for absolute peace of mind.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="bg-[#0D121D] border border-white/5 p-6 rounded-2xl relative shadow-xl">
                <span className="text-4xl font-serif font-light text-amber-500/10 absolute top-4 right-6">{step.number}</span>
                <h3 className="text-base font-serif text-white mb-2 relative z-10">{step.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed relative z-10 font-light">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-20 max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-amber-400 text-[10px] font-bold uppercase tracking-[0.25em] block mb-2">Inquiries</span>
            <h2 className="text-3xl font-serif font-light text-white mb-3">Frequently Asked Questions</h2>
            <p className="text-slate-400 text-xs sm:text-sm font-light">Everything you need to know about private estate representations.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-[#0D121D] border border-white/10 p-6 rounded-2xl shadow-xl">
                <h4 className="text-sm font-serif text-white mb-2 flex items-center gap-2.5">
                  <HelpCircle size={16} className="text-amber-400 shrink-0" /> {faq.q}
                </h4>
                <p className="text-slate-400 text-xs pl-7 leading-relaxed font-light">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

      </main>

    </div>
  );
}