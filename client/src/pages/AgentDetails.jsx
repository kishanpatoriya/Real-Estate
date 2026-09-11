import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  User, Mail, Phone, MapPin, Briefcase, Building, 
  Star, MessageSquare, Send, CheckCircle2, Globe, ShieldCheck 
} from 'lucide-react';

export default function AgentDetails() {
  const { id } = useParams();
  const [agent, setAgent] = useState(null);
  const [agentProperties, setAgentProperties] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review Form State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewerName, setReviewerName] = useState('');

  useEffect(() => {
    fetchAgentFullData();
  }, [id]);

  const fetchAgentFullData = async () => {
    try {
      let currentAgent = null;
      try {
        const agentRes = await axios.get(`https://real-estate-5-hello.onrender.com/api/agents/${id}`);
        currentAgent = agentRes.data;
      } catch {
        const localAgents = JSON.parse(localStorage.getItem('rumh_agents')) || [];
        currentAgent = localAgents.find(a => (a._id === id || a.email === id || a.id === id));
      }
      setAgent(currentAgent);

      const propsRes = await axios.get('https://real-estate-5-hello.onrender.com/api/properties');
      const filtered = propsRes.data.filter(p => p.agentEmail === id || p.agentId === id || p.agentEmail === currentAgent?.email);
      setAgentProperties(filtered.length > 0 ? filtered : propsRes.data.slice(0, 3));

      const storedReviews = JSON.parse(localStorage.getItem(`reviews_${id}`)) || [
        { name: 'Aarav Patel', rating: 5, comment: 'Excellent agent! Very transparent and professional throughout the property deal.', date: '2 days ago' }
      ];
      setReviews(storedReviews);

    } catch (err) {
      console.error('Error fetching agent details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const newReview = {
      name: reviewerName || localStorage.getItem('name') || 'Verified Buyer',
      rating: Number(rating),
      comment: comment,
      date: 'Just now'
    };

    const updated = [newReview, ...reviews];
    setReviews(updated);
    localStorage.setItem(`reviews_${id}`, JSON.stringify(updated));

    setComment('');
    alert('Thank you! Your review has been submitted.');
  };

  if (loading) return <div className="min-h-screen bg-[#070A0F] text-center py-40 text-amber-400 text-xs tracking-widest uppercase font-semibold">Loading advisor dossier...</div>;
  if (!agent) return <div className="min-h-screen bg-[#070A0F] text-center py-40 text-red-400 font-bold text-sm">Advisor not found!</div>;

  return (
    <div className="min-h-screen bg-[#070A0F] text-slate-100 px-6 lg:px-16 pt-36 pb-24 font-sans selection:bg-amber-400 selection:text-slate-950">
      <div className="max-w-6xl mx-auto space-y-14">
        
        {/* AGENT PROFILE HEADER */}
        <div className="bg-[#0D121D] border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            
            <div className="flex flex-col items-center text-center md:border-r border-white/10 md:pr-8">
              <div className="w-28 h-28 rounded-3xl bg-white/5 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 overflow-hidden shadow-xl">
                {agent.photo ? (
                  <img src={agent.photo} alt={agent.name} className="w-full h-full object-cover" />
                ) : (
                  <User size={48} />
                )}
              </div>
              <h2 className="text-2xl font-serif text-white">{agent.name}</h2>
              <p className="text-xs text-amber-400 font-medium mt-0.5">{agent.designation || 'Luxury Estate Advisor'}</p>
              <span className="text-[9px] font-extrabold uppercase tracking-widest bg-amber-500/10 text-amber-300 px-3 py-1 rounded-full border border-amber-500/30 mt-2.5 flex items-center gap-1 shadow-sm">
                <ShieldCheck size={12} /> Verified Partner
              </span>
            </div>

            <div className="md:col-span-2 space-y-5">
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-light">
                {agent.bio || 'Professional real estate advisor dedicated to providing transparent, efficient, and tailored property consulting services.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2 font-medium">
                <div className="flex items-center gap-2.5 p-3.5 bg-black/40 border border-white/5 rounded-2xl">
                  <MapPin size={15} className="text-amber-400 shrink-0" />
                  <span className="text-slate-300">{agent.location || 'Gujarat, India'}</span>
                </div>
                <div className="flex items-center gap-2.5 p-3.5 bg-black/40 border border-white/5 rounded-2xl">
                  <Briefcase size={15} className="text-amber-400 shrink-0" />
                  <span className="text-slate-300">{agent.experience || '5+ Years'} Experience</span>
                </div>
                <div className="flex items-center gap-2.5 p-3.5 bg-black/40 border border-white/5 rounded-2xl">
                  <Mail size={15} className="text-amber-400 shrink-0" />
                  <span className="text-slate-300 truncate">{agent.email}</span>
                </div>
                <div className="flex items-center gap-2.5 p-3.5 bg-black/40 border border-white/5 rounded-2xl">
                  <Phone size={15} className="text-amber-400 shrink-0" />
                  <span className="text-slate-300">{agent.phone || '+91 98765 43210'}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* PROPERTIES LISTED BY AGENT */}
        <div>
          <h3 className="text-2xl font-serif text-white mb-6 flex items-center gap-2">
            <Building size={20} className="text-amber-400" /> Listed Residences ({agentProperties.length})
          </h3>

          {agentProperties.length === 0 ? (
            <div className="bg-[#0D121D] border border-dashed border-white/10 rounded-3xl p-10 text-center text-xs text-slate-400">
              No active listings available for this advisor currently.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {agentProperties.map((prop) => (
                <div key={prop._id || prop.id} className="bg-[#0D121D] border border-white/10 rounded-3xl overflow-hidden shadow-2xl hover:border-amber-500/40 transition-all flex flex-col justify-between">
                  <div className="h-48 w-full bg-slate-900 relative">
                    <img 
                      src={prop.image && prop.image.startsWith('http') ? prop.image : `https://https://real-estate-5-hello.onrender.com${prop.image}`} 
                      alt={prop.title} 
                      className="w-full h-full object-cover brightness-90" 
                    />
                    <span className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-amber-300 border border-amber-500/30 font-serif text-xs px-3 py-1 rounded-lg">
                      ${prop.price}M
                    </span>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-serif text-white text-base mb-1">{prop.title}</h4>
                      <p className="text-xs text-slate-400 flex items-center gap-1"><MapPin size={12} className="text-amber-400" /> {prop.location}</p>
                    </div>

                    <Link 
                      to={`/properties/${prop._id}`} 
                      className="mt-5 block text-center bg-white/5 hover:bg-amber-400 text-slate-200 hover:text-slate-950 font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition border border-white/10 hover:border-transparent"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* REVIEWS & FEEDBACK */}
        <div className="bg-[#0D121D] border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl">
          <h3 className="text-2xl font-serif text-white mb-8 flex items-center gap-2">
            <MessageSquare size={20} className="text-amber-400" /> Client Reviews & Evaluations
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <form onSubmit={handleAddReview} className="bg-black/40 border border-white/5 p-6 rounded-2xl space-y-4 text-xs">
              <h4 className="font-serif text-white text-sm mb-1">Submit Feedback for {agent.name}</h4>
              
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Client Name</label>
                <input 
                  type="text" 
                  placeholder="Enter name" 
                  value={reviewerName} 
                  onChange={(e) => setReviewerName(e.target.value)} 
                  className="w-full bg-[#070A0F] border border-white/10 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-amber-400 font-medium" 
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button 
                      key={star} 
                      type="button" 
                      onClick={() => setRating(star)} 
                      className={`p-2 rounded-xl border transition ${rating >= star ? 'bg-amber-500/10 border-amber-400 text-amber-400' : 'bg-[#070A0F] border-white/10 text-slate-600'}`}
                    >
                      <Star size={16} fill={rating >= star ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Feedback Statement</label>
                <textarea 
                  required
                  rows="3" 
                  placeholder="Share details of your experience..." 
                  value={comment} 
                  onChange={(e) => setComment(e.target.value)} 
                  className="w-full bg-[#070A0F] border border-white/10 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-amber-400 font-medium resize-none"
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg cursor-pointer text-xs uppercase tracking-wider"
              >
                <Send size={13} /> Submit Review
              </button>
            </form>

            <div className="space-y-4">
              <h4 className="font-serif text-white text-sm">Past Client Reviews ({reviews.length})</h4>
              
              {reviews.length === 0 ? (
                <p className="text-xs text-slate-500">No client reviews registered yet.</p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {reviews.map((rev, index) => (
                    <div key={index} className="bg-black/40 border border-white/5 p-4 rounded-2xl text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-200">{rev.name}</span>
                        <span className="text-[10px] text-slate-500">{rev.date}</span>
                      </div>
                      <div className="flex gap-1 text-amber-400">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} size={12} fill="currentColor" />
                        ))}
                      </div>
                      <p className="text-slate-400 leading-relaxed font-light">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}