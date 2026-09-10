import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  ShieldCheck, 
  MapPin, 
  Briefcase, 
  Globe, 
  CheckCircle2, 
  Edit3, 
  Save, 
  X, 
  Upload, 
  Building, 
  PlusCircle, 
  Trash2,
  Calendar,
  Clock,
  XCircle,
  Filter,
  Sparkles
} from 'lucide-react';
import axios from 'axios';
import AgentPlans from '../pages/AgentPlans';

export default function AgentProfile() {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [properties, setProperties] = useState([]);
  const [agentBookings, setAgentBookings] = useState([]);
  const [selectedBookingStatus, setSelectedBookingStatus] = useState('All');
  
  const [agent, setAgent] = useState({
    name: '',
    email: '',
    role: '',
    phone: '+91 98765 43210',
    designation: 'Senior Luxury Estate Specialist',
    experience: '8+ Years',
    location: 'Jamnagar & Ahmedabad, Gujarat',
    specialization: ['Penthouses', 'Sea-Facing Villas', 'Commercial Estates'],
    languages: ['English', 'Hindi', 'Gujarati'],
    bio: 'Dedicated luxury real estate advisor with a proven track record of closing high-end residential and commercial transactions with absolute transparency and discretion.',
    photo: '',
    membershipPlan: 'free',
    propertyLimit: 1,
    badgeType: 'none'
  });

  const [propertyForm, setPropertyForm] = useState({
    title: '',
    location: '',
    price: '',
    beds: '1',
    sqft: '',
    description: ''
  });
  const [imageFiles, setImageFiles] = useState([]);

  useEffect(() => {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    const role = sessionStorage.getItem('role') || localStorage.getItem('role');

    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    if (role !== 'agent') {
      navigate('/user-profile', { replace: true });
      return;
    }

    setIsAuthorized(true);
    const email = sessionStorage.getItem('email') || localStorage.getItem('email') || 'agent@gharsetu.com';
    fetchCurrentAgentProfile(email);
    fetchPropertiesAndBookings(email);
  }, [navigate]);

  const fetchCurrentAgentProfile = async (email) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/agents/${email}`);
      if (res.data) {
        const data = res.data;
        setAgent(prev => ({
          ...prev,
          name: data.name || prev.name,
          email: data.email || prev.email,
          phone: data.phone || prev.phone,
          designation: data.designation || prev.designation,
          experience: data.experience || prev.experience,
          location: data.location || prev.location,
          specialization: data.specialization ? (Array.isArray(data.specialization) ? data.specialization : data.specialization.split(',').map(s => s.trim())) : prev.specialization,
          languages: data.languages ? (Array.isArray(data.languages) ? data.languages : data.languages.split(',').map(l => l.trim())) : prev.languages,
          bio: data.bio || prev.bio,
          photo: data.photo || sessionStorage.getItem('agentPhoto') || localStorage.getItem('agentPhoto') || prev.photo,
          membershipPlan: data.membershipPlan || 'free',
          propertyLimit: data.propertyLimit || 1,
          badgeType: data.badgeType || 'none'
        }));
      }
    } catch {
      const name = sessionStorage.getItem('name') || localStorage.getItem('name');
      const role = sessionStorage.getItem('role') || localStorage.getItem('role');
      const phone = sessionStorage.getItem('phone') || localStorage.getItem('phone');
      const photo = sessionStorage.getItem('agentPhoto') || localStorage.getItem('agentPhoto');
      setAgent(prev => ({
        ...prev,
        name: name || prev.name,
        role: role || 'Agent',
        phone: phone || prev.phone,
        photo: photo || prev.photo
      }));
    }
  };

  const fetchPropertiesAndBookings = async (email) => {
    try {
      const [propsRes, bookingsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/properties'),
        axios.get('http://localhost:5000/api/bookings').catch(() => ({ data: [] }))
      ]);

      const allProps = propsRes.data || [];
      const currentStoredName = sessionStorage.getItem('name') || localStorage.getItem('name') || agent.name;

      const myProperties = allProps.filter(p => 
        p.agentEmail?.toLowerCase() === email?.toLowerCase() || 
        (currentStoredName && p.agentName?.toLowerCase() === currentStoredName.toLowerCase())
      );
      setProperties(myProperties);

      const myPropertiesTitles = myProperties.map(p => p.title?.toLowerCase());

      const filteredBookingsList = (bookingsRes.data || []).filter(b => {
        const matchByEmail = b.agentEmail?.toLowerCase() === email?.toLowerCase();
        const matchByName = currentStoredName && b.agentName?.toLowerCase() === currentStoredName.toLowerCase();
        const matchByPropTitle = b.propertyTitle && myPropertiesTitles.includes(b.propertyTitle.toLowerCase());
        return matchByEmail || matchByName || matchByPropTitle;
      });

      setAgentBookings(filteredBookingsList);
    } catch (err) {
      console.error("Error fetching properties & bookings:", err);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/bookings/${id}`, { status: newStatus });
      alert(`Tour booking marked as ${newStatus}!`);
      
      const email = sessionStorage.getItem('email') || localStorage.getItem('email') || agent.email;
      fetchPropertiesAndBookings(email);
    } catch (err) {
      console.error("Failed to update status:", err);
      alert('Failed to update booking status.');
    }
  };

  const handleChange = (e) => setAgent({ ...agent, [e.target.name]: e.target.value });
  const handlePropertyFormChange = (e) => setPropertyForm({ ...propertyForm, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setImageFiles(e.target.files);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAgent(prev => ({ ...prev, photo: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleAddProperty = async (e) => {
    e.preventDefault();
    
    if (agent.membershipPlan === 'free' && properties.length >= 1) {
      alert('Free Plan limit reached! You can only upload 1 property. Please upgrade to Standard or Premium.');
      setActiveTab('plans');
      return;
    }
    if (agent.membershipPlan === 'standard' && properties.length >= 5) {
      alert('Standard Plan limit reached! You can only upload up to 5 properties. Please upgrade to Premium.');
      setActiveTab('plans');
      return;
    }

    const data = new FormData();
    data.append('title', propertyForm.title);
    data.append('location', propertyForm.location);
    data.append('price', propertyForm.price);
    data.append('beds', propertyForm.beds);
    data.append('baths', '1'); // Default value since baths option is removed
    data.append('sqft', propertyForm.sqft);
    data.append('description', propertyForm.description || '');
    data.append('agentEmail', agent.email);
    data.append('agentName', agent.name);
    
    for (let i = 0; i < imageFiles.length; i++) {
      data.append('images', imageFiles[i]);
    }

    try {
      await axios.post('http://localhost:5000/api/properties', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Estate published successfully!');
      setPropertyForm({ title: '', location: '', price: '', beds: '1', sqft: '', description: '' });
      setImageFiles([]);
      fetchPropertiesAndBookings(agent.email);
      setActiveTab('properties');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to publish property');
    }
  };

  const handleDeleteProperty = async (id) => {
    if (window.confirm("Are you sure you want to remove this estate listing?")) {
      try {
        await axios.delete(`http://localhost:5000/api/properties/${id}`);
        fetchPropertiesAndBookings(agent.email);
      } catch (err) {
        console.error("Error deleting property:", err);
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      name: agent.name,
      phone: agent.phone,
      designation: agent.designation,
      experience: agent.experience,
      location: agent.location,
      specialization: Array.isArray(agent.specialization) ? agent.specialization.join(', ') : agent.specialization,
      languages: Array.isArray(agent.languages) ? agent.languages.join(', ') : agent.languages,
      bio: agent.bio,
      photo: agent.photo
    };

    try {
      await axios.put(`http://localhost:5000/api/agents/${agent.email}`, payload);
      sessionStorage.setItem('phone', agent.phone);
      sessionStorage.setItem('designation', agent.designation);
      sessionStorage.setItem('experience', agent.experience);
      sessionStorage.setItem('location', agent.location);
      sessionStorage.setItem('specialization', payload.specialization);
      sessionStorage.setItem('languages', payload.languages);
      sessionStorage.setItem('bio', agent.bio);
      if (agent.photo) sessionStorage.setItem('agentPhoto', agent.photo);

      setIsEditing(false);
      alert('Advisor dossier and portrait updated successfully!');
    } catch (err) {
      console.error("Save error:", err);
      if (agent.photo) sessionStorage.setItem('agentPhoto', agent.photo);
      setIsEditing(false);
      alert('Profile saved locally!');
    }
  };

  const filteredBookings = selectedBookingStatus === 'All'
    ? agentBookings
    : agentBookings.filter(b => b.status === selectedBookingStatus);

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#070A0F] text-slate-100 px-6 lg:px-16 pt-36 pb-24 font-sans selection:bg-amber-400 selection:text-slate-950">
      <div className="max-w-5xl mx-auto">
        
        {/* Navigation Tabs */}
        <div className="mb-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <span className="text-amber-400 text-[10px] font-bold uppercase tracking-[0.25em] bg-black/40 px-3 py-1 rounded-full border border-amber-500/30 inline-block mb-2">
              Advisor Dashboard
            </span>
            <h1 className="text-3xl font-serif font-light text-white">Welcome, {agent.name || 'Advisor'}</h1>
          </div>
          
          <div className="flex flex-wrap items-center gap-2.5">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition uppercase tracking-wider cursor-pointer ${
                activeTab === 'profile' ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-white/5 text-slate-300 border border-white/10 hover:border-white/20'
              }`}
            >
              My Dossier
            </button>
            <button 
              onClick={() => setActiveTab('plans')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition uppercase tracking-wider cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'plans' ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-white/5 text-slate-300 border border-white/10 hover:border-white/20'
              }`}
            >
              <Sparkles size={13} /> Membership Plan
            </button>
            <button 
              onClick={() => setActiveTab('bookings')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition uppercase tracking-wider cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'bookings' ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-white/5 text-slate-300 border border-white/10 hover:border-white/20'
              }`}
            >
              <Calendar size={13} /> Client Tours ({agentBookings.length})
            </button>
            <button 
              onClick={() => setActiveTab('properties')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition uppercase tracking-wider cursor-pointer ${
                activeTab === 'properties' ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-white/5 text-slate-300 border border-white/10 hover:border-white/20'
              }`}
            >
              Inventory ({properties.length})
            </button>
            <button 
              onClick={() => setActiveTab('add-property')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition uppercase tracking-wider cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'add-property' ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-white/5 text-slate-300 border border-white/10 hover:border-white/20'
              }`}
            >
              <PlusCircle size={14} /> Add Estate
            </button>
          </div>
        </div>

        {/* TAB 1: PROFILE VIEW / EDIT */}
        {activeTab === 'profile' && (
          <div>
            <div className="mb-6 flex justify-end">
              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <Edit3 size={15} /> Edit Profile
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSave} className="bg-[#0D121D] border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6 text-xs">
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <h3 className="text-base font-serif text-white">Edit Advisor Profile</h3>
                  <button type="button" onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-white cursor-pointer">
                    <X size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1.5 uppercase tracking-wider text-[10px]">Upload Portrait</label>
                    <label className="w-full bg-[#070A0F] border border-dashed border-white/20 hover:border-amber-400 rounded-xl p-3 text-slate-400 flex items-center justify-center gap-2 cursor-pointer transition">
                      <Upload size={16} className="text-amber-400" />
                      <span>Choose Portrait File...</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-semibold mb-1.5 uppercase tracking-wider text-[10px]">Phone Number</label>
                    <input type="text" name="phone" value={agent.phone} onChange={handleChange} className="w-full bg-[#070A0F] border border-white/10 rounded-xl p-3 text-slate-200 focus:border-amber-400 focus:outline-none font-medium" required />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-semibold mb-1.5 uppercase tracking-wider text-[10px]">Designation Category</label>
                    <select name="designation" value={agent.designation} onChange={handleChange} className="w-full bg-[#070A0F] border border-white/10 rounded-xl p-3 text-slate-200 focus:border-amber-400 focus:outline-none font-medium cursor-pointer">
                      <option value="Senior Luxury Specialist">Senior Luxury Specialist</option>
                      <option value="Commercial Advisor">Commercial Advisor</option>
                      <option value="Residential Consultant">Residential Consultant</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-semibold mb-1.5 uppercase tracking-wider text-[10px]">Experience</label>
                    <select name="experience" value={agent.experience} onChange={handleChange} className="w-full bg-[#070A0F] border border-white/10 rounded-xl p-3 text-slate-200 focus:border-amber-400 focus:outline-none font-medium cursor-pointer">
                      <option value="1-3 Years">1-3 Years</option>
                      <option value="3-5 Years">3-5 Years</option>
                      <option value="5+ Years">5+ Years</option>
                      <option value="8+ Years">8+ Years</option>
                      <option value="10+ Years">10+ Years</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-semibold mb-1.5 uppercase tracking-wider text-[10px]">Location Hub</label>
                    <input type="text" name="location" value={agent.location} onChange={handleChange} className="w-full bg-[#070A0F] border border-white/10 rounded-xl p-3 text-slate-200 focus:border-amber-400 focus:outline-none font-medium" required />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-semibold mb-1.5 uppercase tracking-wider text-[10px]">Specialization (Comma separated)</label>
                    <input type="text" name="specialization" value={Array.isArray(agent.specialization) ? agent.specialization.join(', ') : agent.specialization} onChange={(e) => setAgent({...agent, specialization: e.target.value})} className="w-full bg-[#070A0F] border border-white/10 rounded-xl p-3 text-slate-200 focus:border-amber-400 focus:outline-none font-medium" required />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1.5 uppercase tracking-wider text-[10px]">Languages Spoken</label>
                  <input type="text" name="languages" value={Array.isArray(agent.languages) ? agent.languages.join(', ') : agent.languages} onChange={(e) => setAgent({...agent, languages: e.target.value})} className="w-full bg-[#070A0F] border border-white/10 rounded-xl p-3 text-slate-200 focus:border-amber-400 focus:outline-none font-medium" required />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1.5 uppercase tracking-wider text-[10px]">Executive Biography</label>
                  <textarea name="bio" rows="3" value={agent.bio} onChange={handleChange} className="w-full bg-[#070A0F] border border-white/10 rounded-xl p-3 text-slate-200 focus:border-amber-400 focus:outline-none resize-none font-medium" required></textarea>
                </div>

                <div className="flex gap-4">
                  <button type="submit" className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-3 rounded-xl uppercase tracking-wider transition cursor-pointer">
                    <Save size={15} className="inline mr-1.5" /> Save Changes
                  </button>
                  <button type="button" onClick={() => setIsEditing(false)} className="bg-white/5 hover:bg-white/10 text-slate-300 font-bold px-6 py-3 rounded-xl transition cursor-pointer border border-white/10">
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="bg-[#0D121D] border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start relative z-10">
                  <div className="flex flex-col items-center text-center md:border-r border-white/10 md:pr-8">
                    <div className="w-32 h-32 rounded-3xl bg-white/5 border border-amber-500/30 p-1 mb-4 shadow-xl overflow-hidden relative">
                      {agent.photo ? (
                        <img src={agent.photo} alt={agent.name} className="w-full h-full object-cover rounded-2xl" />
                      ) : (
                        <div className="w-full h-full bg-[#070A0F] rounded-2xl flex items-center justify-center text-amber-400 text-4xl font-serif">
                          {agent.name ? agent.name.charAt(0).toUpperCase() : 'A'}
                        </div>
                      )}
                      
                      {agent.badgeType === 'yellow' && (
                        <span className="absolute bottom-2 right-2 bg-amber-500 text-slate-950 p-1 rounded-full shadow-lg" title="Verified Elite Badge (Yellow)">
                          <ShieldCheck size={14} />
                        </span>
                      )}
                      {agent.badgeType === 'green' && (
                        <span className="absolute bottom-2 right-2 bg-emerald-500 text-slate-950 p-1 rounded-full shadow-lg" title="Verified Elite Badge (Green)">
                          <ShieldCheck size={14} />
                        </span>
                      )}
                    </div>

                    <h2 className="text-2xl font-serif text-white mb-1">{agent.name || 'Luxury Advisor'}</h2>
                    <p className="text-xs font-semibold text-amber-400 mb-3">{agent.designation}</p>
                    
                    <div className="flex items-center gap-2 mb-6">
                      <span className="bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[9px] font-extrabold uppercase tracking-widest px-3.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                        <ShieldCheck size={13} /> {agent.membershipPlan?.toUpperCase()} PLAN
                      </span>
                      {agent.badgeType !== 'none' && (
                        <span className={`text-[9px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full border shadow-sm ${
                          agent.badgeType === 'green' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        }`}>
                          {agent.badgeType.toUpperCase()} BADGE
                        </span>
                      )}
                    </div>

                    <div className="w-full space-y-2 text-left text-xs text-slate-400 border-t border-white/10 pt-4 font-light">
                      <div className="flex items-center gap-2"><MapPin size={14} className="text-amber-400 shrink-0" /> {agent.location}</div>
                      <div className="flex items-center gap-2"><Briefcase size={14} className="text-amber-400 shrink-0" /> {agent.experience} Experience</div>
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-6">
                    <div>
                      <h3 className="text-xs font-serif text-white uppercase tracking-widest mb-2 font-bold">Executive Profile</h3>
                      <p className="text-slate-400 text-xs leading-relaxed font-light">{agent.bio}</p>
                    </div>

                    <div className="bg-black/40 border border-white/5 p-5 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-white/5 text-amber-400"><Mail size={16} /></div>
                        <div>
                          <span className="text-slate-500 block text-[10px] font-semibold">Email</span>
                          <span className="font-semibold text-slate-200">{agent.email || 'Not Provided'}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-white/5 text-amber-400"><Phone size={16} /></div>
                        <div>
                          <span className="text-slate-500 block text-[10px] font-semibold">Direct Helpline</span>
                          <span className="font-semibold text-slate-200">{agent.phone}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                      <div>
                        <h4 className="text-[10px] font-bold text-amber-400 mb-2 uppercase tracking-widest">Specializations</h4>
                        <div className="flex flex-wrap gap-2">
                          {(Array.isArray(agent.specialization) ? agent.specialization : [agent.specialization]).map((spec, i) => (
                            <span key={i} className="bg-white/5 border border-white/10 text-slate-300 text-[10px] font-medium px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                              <CheckCircle2 size={12} className="text-amber-400" /> {spec}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-[10px] font-bold text-amber-400 mb-2 uppercase tracking-widest">Languages</h4>
                        <div className="flex flex-wrap gap-2">
                          {(Array.isArray(agent.languages) ? agent.languages : [agent.languages]).map((lang, i) => (
                            <span key={i} className="bg-white/5 border border-white/10 text-slate-300 text-[10px] font-medium px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                              <Globe size={12} className="text-amber-400" /> {lang}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 1.5: MEMBERSHIP PLANS */}
        {activeTab === 'plans' && (
          <AgentPlans 
            agentEmail={agent.email} 
            currentPlan={agent.membershipPlan} 
            onPlanUpdated={(updatedAgent) => {
              setAgent(prev => ({
                ...prev,
                membershipPlan: updatedAgent.membershipPlan,
                propertyLimit: updatedAgent.propertyLimit,
                badgeType: updatedAgent.badgeType
              }));
            }} 
          />
        )}

        {/* TAB 2: CLIENT BOOKINGS */}
        {activeTab === 'bookings' && (
          <div className="bg-[#0D121D] border border-white/10 p-8 rounded-3xl shadow-2xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <h2 className="text-xl font-serif flex items-center gap-2.5 text-white">
                <Calendar size={20} className="text-amber-400" /> Client Walkthrough Requests ({filteredBookings.length})
              </h2>

              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 text-xs font-semibold">
                <span className="text-slate-400 flex items-center gap-1"><Filter size={14} className="text-amber-400" /> Filter:</span>
                {['All', 'Pending', 'Confirmed', 'Cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setSelectedBookingStatus(status)}
                    className={`px-3.5 py-1.5 rounded-xl transition shrink-0 cursor-pointer ${
                      selectedBookingStatus === status 
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-md' 
                        : 'bg-[#070A0F] border border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {filteredBookings.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl bg-[#070A0F]">
                <Calendar size={36} className="mx-auto text-amber-400 mb-3 opacity-30" />
                <p className="text-slate-400 text-xs">No client tour requests scheduled for your properties.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBookings.map((tour) => (
                  <div 
                    key={tour._id} 
                    className="bg-black/40 border border-white/10 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-5 hover:border-amber-500/30 transition-all shadow-xl"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h4 className="font-serif text-white text-base font-semibold">{tour.userName}</h4>
                        <span className={`text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-md border ${
                          tour.status === 'Confirmed' 
                            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' 
                            : tour.status === 'Cancelled'
                            ? 'bg-red-500/10 text-red-300 border-red-500/30'
                            : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                        }`}>
                          {tour.status || 'Pending'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                        <Building size={14} className="text-amber-400 shrink-0" />
                        <span>Estate: <strong className="text-white">{tour.propertyTitle || 'Luxury Landmark'}</strong></span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1 font-medium">
                        <div className="flex items-center gap-1.5 bg-[#070A0F] px-3 py-1.5 rounded-xl border border-white/5">
                          <Calendar size={13} className="text-amber-400 shrink-0" />
                          <span>Date: <strong className="text-white">{tour.date}</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-[#070A0F] px-3 py-1.5 rounded-xl border border-white/5">
                          <Clock size={13} className="text-amber-400 shrink-0" />
                          <span>Time: <strong className="text-white">{tour.time}</strong></span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-white pt-1">
                        <span className="flex items-center gap-1.5">
                          <Mail size={13} className="text-amber-400" /> {tour.userEmail}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Phone size={13} className="text-amber-400" /> {tour.phone}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0">
                      {tour.status !== 'Confirmed' && (
                        <button 
                          onClick={() => handleUpdateStatus(tour._id, 'Confirmed')}
                          className="bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-white px-3.5 py-2 rounded-xl text-xs uppercase tracking-wider font-bold transition flex items-center gap-1.5 border border-emerald-500/30 cursor-pointer shadow-sm"
                        >
                          <CheckCircle2 size={14} /> Confirm
                        </button>
                      )}

                      {tour.status !== 'Cancelled' && (
                        <button 
                          onClick={() => handleUpdateStatus(tour._id, 'Cancelled')}
                          className="bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white px-3.5 py-2 rounded-xl text-xs uppercase tracking-wider font-bold transition flex items-center gap-1.5 border border-red-500/30 cursor-pointer shadow-sm"
                        >
                          <XCircle size={14} /> Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PROPERTIES INVENTORY */}
        {activeTab === 'properties' && (
          <div className="bg-[#0D121D] border border-white/10 p-8 rounded-3xl shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-serif flex items-center gap-2.5 text-white">
                <Building size={20} className="text-amber-400" /> My Listed Portfolio ({properties.length} / {agent.membershipPlan === 'free' ? '1 Limit' : agent.membershipPlan === 'standard' ? '5 Limit' : 'Unlimited'})
              </h2>
              <button 
                onClick={() => setActiveTab('add-property')}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5"
              >
                <PlusCircle size={14} /> Add Property
              </button>
            </div>

            {properties.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl bg-[#070A0F]">
                <p className="text-slate-400 text-xs">You haven't added any luxury properties to your inventory yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {properties.map((prop) => (
                  <div key={prop._id} className="bg-black/40 border border-white/5 p-4 rounded-2xl flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img src={prop.image && prop.image.startsWith('http') ? prop.image : `http://localhost:5000${prop.image}`} alt={prop.title} className="w-16 h-16 object-cover rounded-xl border border-white/10" />
                      <div>
                        <h4 className="font-serif text-white text-sm">{prop.title}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">{prop.location}</p>
                        <p className="text-xs font-serif text-amber-400 mt-1">${prop.price}M</p>
                      </div>
                    </div>
                    <button onClick={() => handleDeleteProperty(prop._id)} className="bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white p-3 rounded-xl transition border border-red-500/30 cursor-pointer">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: ADD PROPERTY (Bathrooms option removed, matching Properties page filters/options) */}
        {activeTab === 'add-property' && (
          <div className="bg-[#0D121D] border border-white/10 p-8 rounded-3xl shadow-2xl max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-serif flex items-center gap-2.5 text-white">
                <PlusCircle size={20} className="text-amber-400" /> Publish Luxury Estate
              </h2>
              <span className="text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                Plan: {agent.membershipPlan?.toUpperCase()} ({properties.length} / {agent.propertyLimit === 999999 ? 'Unlimited' : agent.propertyLimit})
              </span>
            </div>

            <form onSubmit={handleAddProperty} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">Estate Title</label>
                <input type="text" name="title" required placeholder="e.g., Grand Peninsula Villa" value={propertyForm.title} onChange={handlePropertyFormChange} className="w-full bg-[#070A0F] border border-white/10 rounded-2xl px-4 py-3 text-slate-200 placeholder-slate-500 focus:border-amber-400 focus:outline-none font-medium" />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">Prime Location / City</label>
                <input type="text" name="location" required placeholder="e.g., Ahmedabad, Gujarat" value={propertyForm.location} onChange={handlePropertyFormChange} className="w-full bg-[#070A0F] border border-white/10 rounded-2xl px-4 py-3 text-slate-200 placeholder-slate-500 focus:border-amber-400 focus:outline-none font-medium" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">Price ($M)</label>
                  <input type="number" step="0.1" name="price" required placeholder="e.g., 4.5" value={propertyForm.price} onChange={handlePropertyFormChange} className="w-full bg-[#070A0F] border border-white/10 rounded-2xl px-4 py-3 text-slate-200 placeholder-slate-500 focus:border-amber-400 focus:outline-none font-medium" />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">Square Feet (sqft)</label>
                  <input type="number" name="sqft" required placeholder="e.g., 3500" value={propertyForm.sqft} onChange={handlePropertyFormChange} className="w-full bg-[#070A0F] border border-white/10 rounded-2xl px-4 py-3 text-slate-200 placeholder-slate-500 focus:border-amber-400 focus:outline-none font-medium" />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">Bedrooms (BHK)</label>
                <select name="beds" value={propertyForm.beds} onChange={handlePropertyFormChange} className="w-full bg-[#070A0F] border border-white/10 rounded-2xl px-4 py-3 text-slate-200 focus:border-amber-400 focus:outline-none font-medium cursor-pointer">
                  <option value="1">1 BHK</option>
                  <option value="2">2 BHK</option>
                  <option value="3">3 BHK</option>
                  <option value="4">4 BHK</option>
                  <option value="5">5+ BHK</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">Property Images</label>
                <input type="file" name="images" accept="image/*" multiple required onChange={handleFileChange} className="w-full bg-[#070A0F] border border-white/10 rounded-2xl px-4 py-2 text-slate-400 file:mr-4 file:py-1.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-500 file:text-slate-950 cursor-pointer" />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">Estate Description</label>
                <textarea name="description" placeholder="Provide details about architecture, amenities, and views..." value={propertyForm.description} onChange={handlePropertyFormChange} className="w-full bg-[#070A0F] border border-white/10 rounded-2xl p-4 text-slate-200 placeholder-slate-500 focus:border-amber-400 focus:outline-none h-28 resize-none font-medium"></textarea>
              </div>

              <button type="submit" className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-3.5 rounded-2xl uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 shadow-lg">
                <Upload size={15} /> Publish Estate
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}