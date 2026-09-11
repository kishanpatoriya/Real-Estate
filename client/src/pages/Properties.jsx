import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Building, MapPin, Bed, Bath, Square, ArrowRight, Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBeds, setSelectedBeds] = useState('All');

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await axios.get('https://real-estate-5-hello.onrender.com/api/properties');
      setProperties(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching properties:", err);
      setLoading(false);
    }
  };

  const filteredProperties = properties.filter((prop) => {
    const title = prop.title ? String(prop.title).toLowerCase() : '';
    const location = prop.location ? String(prop.location).toLowerCase() : '';
    const query = searchTerm.toLowerCase();

    const matchesSearch = title.includes(query) || location.includes(query);
    const matchesBeds = selectedBeds === 'All' || String(prop.beds) === selectedBeds;

    return matchesSearch && matchesBeds;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070A0F] text-amber-400 flex items-center justify-center font-sans">
        <p className="text-xs uppercase font-extrabold tracking-[0.25em] animate-pulse">Loading Luxury Portfolio...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070A0F] text-slate-100 font-sans selection:bg-amber-400 selection:text-slate-950 flex flex-col justify-between">
      
      <div className="flex-grow px-6 lg:px-12 pt-36 pb-24">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-12">
            <span className="text-amber-400 text-[10px] font-extrabold uppercase tracking-[0.25em] bg-black/40 px-4 py-1.5 rounded-full border border-amber-500/30 inline-flex items-center gap-1.5 mb-4 shadow-sm">
              <Sparkles size={12} /> Curated Collection
            </span>
            <h1 className="text-3xl md:text-5xl font-serif font-light tracking-tight text-white">Private Luxury Residences</h1>
          </div>

          {/* Filter Bar */}
          <div className="bg-[#0D121D] border border-white/10 p-4 rounded-2xl mb-12 flex flex-col md:flex-row gap-4 items-center justify-between shadow-2xl">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3.5 top-3.5 text-slate-500" size={16} />
              <input 
                type="text" 
                placeholder="Search title, city or region..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#070A0F] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400 font-medium"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold flex items-center gap-1 shrink-0">
                <SlidersHorizontal size={13} className="text-amber-400" /> Bedrooms:
              </span>
              {['All', '1', '2', '3', '4', '5'].map((beds) => (
                <button
                  key={beds}
                  onClick={() => setSelectedBeds(beds)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${
                    selectedBeds === beds 
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md' 
                      : 'bg-[#070A0F] text-slate-400 border border-white/10 hover:border-white/20'
                  }`}
                >
                  {beds === 'All' ? 'All' : `${beds} BHK`}
                </button>
              ))}
            </div>
          </div>

          {/* Properties Grid */}
          {filteredProperties.length === 0 ? (
            <div className="text-center bg-[#0D121D] border border-white/10 rounded-3xl p-16 max-w-md mx-auto shadow-2xl">
              <Building size={40} className="mx-auto text-amber-400 mb-4 opacity-50" />
              <h3 className="text-lg font-serif text-white">No Estates Found</h3>
              <p className="text-xs text-slate-400 mt-2 font-light">Try adjusting your search criteria or bedroom filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties.map((prop) => {
                const mainImg = prop.image 
                  ? (prop.image.startsWith('http') ? prop.image : `https://real-estate-1azb.onrender.com${prop.image}`)
                  : (prop.images && prop.images.length > 0 ? (prop.images[0].startsWith('http') ? prop.images[0] : `https://real-estate-1azb.onrender.com${prop.images[0]}`) : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800');

                return (
                  <div key={prop._id} className="bg-[#0D121D] border border-white/10 rounded-3xl overflow-hidden shadow-2xl hover:border-amber-500/40 transition-all duration-500 flex flex-col justify-between group">
                    <div>
                      <div className="relative h-72 overflow-hidden bg-slate-900">
                        <img 
                          src={mainImg} 
                          alt={prop.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-700 brightness-90 group-hover:brightness-100"
                        />
                        <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md text-amber-300 font-serif text-sm px-3.5 py-1.5 rounded-xl border border-amber-500/30 shadow-md">
                          ${prop.price}M
                        </div>
                      </div>
                      <div className="p-7">
                        <div className="flex items-center gap-1.5 text-amber-400 text-[10px] uppercase tracking-wider mb-2 font-semibold">
                          <MapPin size={13} className="text-amber-400" /> {prop.location}
                        </div>
                        <h3 className="text-lg font-serif text-white mb-4 group-hover:text-amber-300 transition">{prop.title}</h3>
                        <div className="grid grid-cols-3 gap-2 py-3.5 border-y border-white/10 text-center text-xs text-slate-300 font-medium">
                          <div className="flex items-center justify-center gap-1.5"><Bed size={13} className="text-amber-400" /> {prop.beds} Beds</div>
                          <div className="border-x border-white/10 flex items-center justify-center gap-1.5"><Bath size={13} className="text-amber-400" /> {prop.baths} Baths</div>
                          <div className="flex items-center justify-center gap-1.5"><Square size={13} className="text-amber-400" /> {prop.sqft} sqft</div>
                        </div>
                      </div>
                    </div>
                    <div className="px-7 pb-7 pt-2">
                      <Link to={`/properties/${prop._id}`} className="w-full bg-white/5 hover:bg-amber-400 text-slate-200 hover:text-slate-950 font-bold py-3.5 rounded-xl transition-all duration-300 text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 border border-white/10 hover:border-transparent">
                        Private Viewings <ArrowRight size={13} />
                      </Link> 
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}