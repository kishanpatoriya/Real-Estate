import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  PlusCircle, 
  Trash2, 
  Building, 
  LogOut, 
  Upload, 
  Sparkles, 
  Users, 
  Filter, 
  MessageSquare, 
  Mail, 
  Eye, 
  X, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Phone,
  UserCheck,
  User,
  MapPin,
  ChevronLeft,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export default function AdminDashboard() {
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [selectedAgentCategory, setSelectedAgentCategory] = useState('All');
  const [selectedBookingStatus, setSelectedBookingStatus] = useState('All');
  const [viewingProperty, setViewingProperty] = useState(null);
  const [agents, setAgents] = useState([]);
  const [activeTab, setActiveTab] = useState('inventory');
  
  const itemsPerPage = 5;
  const [inventoryPage, setInventoryPage] = useState(1);
  const [bookingsPage, setBookingsPage] = useState(1);
  const [usersPage, setUsersPage] = useState(1);
  const [agentsPage, setAgentsPage] = useState(1);
  const [inquiriesPage, setInquiriesPage] = useState(1);
  const [subscribersPage, setSubscribersPage] = useState(1);

  const [formData, setFormData] = useState({
    title: '',
    location: '',
    price: '',
    beds: '1',
    sqft: '',
    description: ''
  });

  const [imageFiles, setImageFiles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProperties();
    fetchBookings();
    fetchInquiries();
    fetchSubscribers();
    fetchAgents();
    fetchUsers();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await axios.get('https://real-estate-5-hello.onrender.com/api/properties');
      setProperties(response.data);
    } catch (err) {
      console.error("Error fetching properties:", err);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await axios.get('https://real-estate-5-hello.onrender.com/api/bookings');
      setBookings(response.data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  const fetchInquiries = async () => {
    try {
      const response = await axios.get('https://real-estate-5-hello.onrender.com/api/contact');
      setInquiries(response.data);
    } catch (err) {
      console.error("Error fetching inquiries:", err);
    }
  };

  const fetchSubscribers = async () => {
    try {
      const response = await axios.get('https://real-estate-5-hello.onrender.com/api/newsletter');
      setSubscribers(response.data);
    } catch (err) {
      console.error("Error fetching subscribers:", err);
    }
  };

  const fetchAgents = async () => {
    try {
      const response = await axios.get('https://real-estate-5-hello.onrender.com/api/agents');
      setAgents(response.data.map(ag => ({
        id: ag._id || ag.id,
        name: ag.name,
        email: ag.email,
        photo: ag.photo || '',
        designation: ag.designation || 'Senior Luxury Specialist',
        phone: ag.phone || '+91 98765 43210',
        location: ag.location || 'Gujarat, India',
        membershipPlan: ag.membershipPlan || 'free',
        propertyLimit: ag.propertyLimit || 1,
        badgeType: ag.badgeType || 'none',
        utrNumber: ag.utrNumber || '',
        paymentStatus: ag.paymentStatus || 'Not Submitted'
      })));
    } catch (err) {
      console.error("Error fetching agents:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://real-estate-5-hello.onrender.com/api/users');
      setUsersList(response.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleConfirmAgentPlan = async (agentEmail, planType) => {
    let limit = 1;
    let badge = 'none';

    if (planType === 'standard') {
      limit = 5;
      badge = 'yellow';
    } else if (planType === 'premium') {
      limit = 999999;
      badge = 'green';
    }

    try {
      await axios.put(`https://real-estate-5-hello.onrender.com/api/agents/plan/${agentEmail}`, {
        membershipPlan: planType,
        propertyLimit: limit,
        badgeType: badge,
        paymentStatus: 'Verified & Active'
      });
      alert(`Advisor plan upgraded to ${planType.toUpperCase()} successfully!`);
      fetchAgents();
    } catch (err) {
      console.error("Error confirming plan:", err);
      alert('Failed to update agent membership plan.');
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setImageFiles(e.target.files);

  const handleAddProperty = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', formData.title);
    data.append('location', formData.location);
    data.append('price', formData.price);
    data.append('beds', formData.beds);
    data.append('baths', '1'); // Default value since baths option is removed
    data.append('sqft', formData.sqft);
    data.append('description', formData.description || '');
    data.append('agentEmail', 'admin@gmail.com');
    data.append('agentName', 'Admin');
    
    for (let i = 0; i < imageFiles.length; i++) {
      data.append('images', imageFiles[i]);
    }

    try {
      await axios.post('https://real-estate-5-hello.onrender.com/api/properties', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Estate published successfully!');
      setFormData({ title: '', location: '', price: '', beds: '1', sqft: '', description: '' });
      setImageFiles([]);
      fetchProperties();
      setActiveTab('inventory');
    } catch (err) {
      alert('Failed to publish estate');
    }
  };

  const handleUpdateBookingStatus = async (id, status) => {
    try {
      await axios.put(`https://real-estate-5-hello.onrender.com/api/bookings/${id}`, { status });
      fetchBookings();
      alert(`Tour booking status marked as ${status}!`);
    } catch (err) {
      alert('Failed to update booking status.');
    }
  };

  const handleDeleteBooking = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this client tour booking?")) {
      try {
        await axios.delete(`https://real-estate-5-hello.onrender.com/api/bookings/${id}`);
        fetchBookings();
        alert("Booking tour record permanently deleted!");
      } catch (err) {
        console.error("Error deleting booking:", err);
        alert("Failed to delete booking record.");
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Remove this property? It will also remove all walkthrough bookings for this estate.")) {
      try {
        await axios.delete(`https://real-estate-5-hello.onrender.com/api/properties/${id}`);
        fetchProperties();
        fetchBookings();
      } catch (err) {
        console.error("Error deleting property:", err);
      }
    }
  };

  const handleDeleteAgent = async (id) => {
    if (window.confirm("Are you sure? Removing this agent will permanently delete the agent, all their properties, and all scheduled walkthrough bookings.")) {
      try {
        await axios.delete(`https://real-estate-5-hello.onrender.com/api/agents/${id}`);
        fetchAgents();
        fetchProperties();
        fetchBookings();
        alert("Advisor, listed properties, and related tour bookings removed!");
      } catch (err) {
        console.error("Error deleting agent:", err);
        alert("Failed to remove agent.");
      }
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this Client Member? Their account and all their tour bookings will be permanently removed.")) {
      try {
        await axios.delete(`https://real-estate-5-hello.onrender.com/api/users/${id}`);
        fetchUsers();
        fetchBookings();
        alert("Client member and all their tour bookings removed successfully!");
      } catch (err) {
        console.error("Error deleting user:", err);
        alert("Failed to delete user.");
      }
    }
  };

  const handleDeleteInquiry = async (id) => {
    if (window.confirm("Delete inquiry?")) {
      await axios.delete(`https://real-estate-5-hello.onrender.com/api/contact/${id}`);
      fetchInquiries();
    }
  };

  const handleDeleteSubscriber = async (id) => {
    if (window.confirm("Remove subscriber?")) {
      await axios.delete(`https://real-estate-5-hello.onrender.com/api/newsletter/${id}`);
      fetchSubscribers();
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    navigate('/admin-login');
  };

  const filteredAgents = selectedAgentCategory === 'All' 
    ? agents 
    : agents.filter(ag => ag.designation === selectedAgentCategory);

  const filteredBookings = selectedBookingStatus === 'All'
    ? bookings
    : bookings.filter(b => b.status === selectedBookingStatus);

  const renderPagination = (totalItems, currentPage, setPage) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages <= 1) return null;

    const firstIndex = (currentPage - 1) * itemsPerPage;
    const lastIndex = Math.min(firstIndex + itemsPerPage, totalItems);

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-white/10 text-xs">
        <p className="text-slate-400 font-medium">
          Showing <strong className="text-amber-400">{firstIndex + 1}</strong> to{' '}
          <strong className="text-amber-400">{lastIndex}</strong> of{' '}
          <strong className="text-white">{totalItems}</strong> Records
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="bg-black/50 hover:bg-amber-500 hover:text-slate-950 disabled:opacity-40 text-slate-300 p-2.5 rounded-xl border border-white/10 transition cursor-pointer disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => setPage(pageNum)}
              className={`w-9 h-9 rounded-xl font-bold transition cursor-pointer flex items-center justify-center ${
                currentPage === pageNum
                  ? 'bg-amber-500 text-slate-950 shadow-md scale-105'
                  : 'bg-black/40 border border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              {pageNum}
            </button>
          ))}

          <button
            onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="bg-black/50 hover:bg-amber-500 hover:text-slate-950 disabled:opacity-40 text-slate-300 p-2.5 rounded-xl border border-white/10 transition cursor-pointer disabled:cursor-not-allowed"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    );
  };

  const currentProperties = properties.slice((inventoryPage - 1) * itemsPerPage, inventoryPage * itemsPerPage);
  const currentBookings = filteredBookings.slice((bookingsPage - 1) * itemsPerPage, bookingsPage * itemsPerPage);
  const currentUsers = usersList.slice((usersPage - 1) * itemsPerPage, usersPage * itemsPerPage);
  const currentAgents = filteredAgents.slice((agentsPage - 1) * itemsPerPage, agentsPage * itemsPerPage);
  const currentInquiries = inquiries.slice((inquiriesPage - 1) * itemsPerPage, inquiriesPage * itemsPerPage);
  const currentSubscribers = subscribers.slice((subscribersPage - 1) * itemsPerPage, subscribersPage * itemsPerPage);

  return (
    <div className="min-h-screen bg-[#070A0F] text-slate-100 font-sans flex selection:bg-amber-400 selection:text-slate-950">
      
      {/* Sidebar */}
      <aside className="w-72 bg-[#0B0F17] border-r border-white/10 p-8 flex flex-col justify-between hidden md:flex fixed h-full z-20 shadow-2xl">
        <div>
          <div className="mb-12">
            <span className="text-amber-400 text-[10px] font-extrabold uppercase tracking-widest bg-black/40 px-3 py-1.5 rounded-full border border-amber-500/30 inline-flex items-center gap-1.5 mb-3">
              <Sparkles size={12} /> Executive Suite
            </span>
            <h2 className="text-xl font-serif text-white">GharSetu Control</h2>
          </div>

          <nav className="space-y-2 text-xs font-semibold uppercase tracking-wider">
            <button 
              onClick={() => setActiveTab('inventory')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition cursor-pointer ${
                activeTab === 'inventory' ? 'bg-amber-500 text-slate-950 font-bold shadow-lg' : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Building size={16} /> Estate Inventory ({properties.length})
            </button>

            <button 
              onClick={() => setActiveTab('bookings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition cursor-pointer ${
                activeTab === 'bookings' ? 'bg-amber-500 text-slate-950 font-bold shadow-lg' : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Calendar size={16} /> Confirmed Tours
              <span className="ml-auto bg-black/50 px-2 py-0.5 rounded-lg text-[10px]">{bookings.length}</span>
            </button>

            <button 
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition cursor-pointer ${
                activeTab === 'users' ? 'bg-amber-500 text-slate-950 font-bold shadow-lg' : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <UserCheck size={16} /> Client Members
              <span className="ml-auto bg-black/50 px-2 py-0.5 rounded-lg text-[10px]">{usersList.length}</span>
            </button>

            <button 
              onClick={() => setActiveTab('add')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition cursor-pointer ${
                activeTab === 'add' ? 'bg-amber-500 text-slate-950 font-bold shadow-lg' : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <PlusCircle size={16} /> Publish New Estate
            </button>

            <button 
              onClick={() => setActiveTab('agents')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition cursor-pointer ${
                activeTab === 'agents' ? 'bg-amber-500 text-slate-950 font-bold shadow-lg' : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Users size={16} /> Advisors Desk 
              <span className="ml-auto bg-black/50 px-2 py-0.5 rounded-lg text-[10px]">{agents.length}</span>
            </button>

            <button 
              onClick={() => setActiveTab('plans-verification')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition cursor-pointer ${
                activeTab === 'plans-verification' ? 'bg-amber-500 text-slate-950 font-bold shadow-lg' : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <ShieldCheck size={16} /> Advisor Plans & UTR
              <span className="ml-auto bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-lg text-[10px]">
                {agents.filter(a => a.paymentStatus === 'Verification Pending').length}
              </span>
            </button>

            <button 
              onClick={() => setActiveTab('inquiries')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition cursor-pointer ${
                activeTab === 'inquiries' ? 'bg-amber-500 text-slate-950 font-bold shadow-lg' : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <MessageSquare size={16} /> Client Inquiries 
              <span className="ml-auto bg-black/50 px-2 py-0.5 rounded-lg text-[10px]">{inquiries.length}</span>
            </button>

            <button 
              onClick={() => setActiveTab('subscribers')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition cursor-pointer ${
                activeTab === 'subscribers' ? 'bg-amber-500 text-slate-950 font-bold shadow-lg' : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Mail size={16} /> Subscribers 
              <span className="ml-auto bg-black/50 px-2 py-0.5 rounded-lg text-[10px]">{subscribers.length}</span>
            </button>
          </nav>
        </div>

        <div>
          <button onClick={handleLogout} className="w-full bg-red-500/20 hover:bg-red-500 border border-red-500/30 text-red-300 hover:text-white px-4 py-3 rounded-2xl text-xs uppercase tracking-wider font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-sm">
            <LogOut size={16} /> Secure Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-72 p-6 lg:p-12 pt-28">
        <div className="max-w-5xl mx-auto">

          {/* TAB 1: INVENTORY */}
          {activeTab === 'inventory' && (
            <div className="bg-[#0D121D] border border-white/10 p-8 rounded-3xl shadow-2xl">
              <h2 className="text-xl font-serif mb-8 flex items-center gap-2.5 text-white">
                <Building size={20} className="text-amber-400" /> Estate Inventory ({properties.length})
              </h2>
              {properties.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl bg-[#070A0F]">
                  <p className="text-slate-400 text-xs">No properties listed in inventory yet.</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {currentProperties.map((prop) => (
                      <div key={prop._id} className="bg-black/40 border border-white/5 p-4 rounded-2xl flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <img src={prop.image && prop.image.startsWith('http') ? prop.image : `https://https://real-estate-5-hello.onrender.com${prop.image}`} alt={prop.title} className="w-16 h-16 object-cover rounded-xl border border-white/10" />
                          <div>
                            <h4 className="font-serif text-white text-sm">{prop.title}</h4>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {prop.location} • <span className="text-amber-400 font-medium">Advisor: {prop.agentName || 'Admin'}</span>
                            </p>
                            <p className="text-xs font-serif text-amber-300 mt-1">${prop.price}M</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button onClick={() => setViewingProperty(prop)} className="bg-white/5 hover:bg-amber-400 text-slate-300 hover:text-slate-950 p-3 rounded-xl transition border border-white/10 cursor-pointer">
                            <Eye size={16} />
                          </button>
                          <button onClick={() => handleDelete(prop._id)} className="bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white p-3 rounded-xl transition border border-red-500/30 cursor-pointer">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  {renderPagination(properties.length, inventoryPage, setInventoryPage)}
                </>
              )}
            </div>
          )}

          {/* TAB: PLANS & UTR VERIFICATION */}
          {activeTab === 'plans-verification' && (
            <div className="bg-[#0D121D] border border-white/10 p-8 rounded-3xl shadow-2xl">
              <div className="mb-8">
                <h2 className="text-xl font-serif flex items-center gap-2.5 text-white mb-2">
                  <ShieldCheck size={22} className="text-amber-400" /> Advisor Membership & Payment Verification
                </h2>
                <p className="text-xs text-slate-400 font-light">Review UTR / Reference numbers submitted by advisors, confirm their specific chosen plan, or remove invalid requests.</p>
              </div>

              {agents.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl bg-[#070A0F]">
                  <Users size={36} className="mx-auto text-amber-400 mb-3 opacity-40" />
                  <p className="text-slate-400 text-xs">No advisors registered in the system.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {agents.map((ag) => (
                    <div key={ag.id} className="bg-black/40 border border-white/10 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center text-amber-400 font-serif text-xl shrink-0">
                          {ag.photo ? <img src={ag.photo} alt={ag.name} className="w-full h-full object-cover" /> : ag.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-serif text-white text-base font-semibold">{ag.name}</h4>
                          <p className="text-xs text-slate-400">{ag.email} • {ag.phone}</p>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <span className="bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-md">
                              Selected Plan: {ag.membershipPlan.toUpperCase()} ({ag.membershipPlan === 'standard' ? '₹2,999' : ag.membershipPlan === 'premium' ? '₹7,999' : 'Free'})
                            </span>
                            <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-md border ${
                              ag.paymentStatus === 'Verification Pending' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse' : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                            }`}>
                              Status: {ag.paymentStatus}
                            </span>
                          </div>
                          {ag.utrNumber && (
                            <p className="text-xs text-slate-300 mt-2 bg-[#070A0F] px-3 py-1.5 rounded-xl border border-white/5 inline-block">
                              Submitted UTR: <strong className="text-amber-400 font-mono">{ag.utrNumber}</strong>
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-white/10">
                        {ag.membershipPlan === 'standard' && (
                          <button 
                            onClick={() => handleConfirmAgentPlan(ag.email, 'standard')}
                            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider transition cursor-pointer shadow-lg"
                          >
                            Confirm Standard (₹2,999)
                          </button>
                        )}

                        {ag.membershipPlan === 'premium' && (
                          <button 
                            onClick={() => handleConfirmAgentPlan(ag.email, 'premium')}
                            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider transition cursor-pointer shadow-lg"
                          >
                            Confirm Elite VIP (₹7,999)
                          </button>
                        )}

                        {ag.membershipPlan === 'free' && (
                          <span className="text-xs text-slate-500 italic mr-2">Free Tier</span>
                        )}

                        <button 
                          onClick={() => handleDeleteAgent(ag.id)}
                          className="bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white p-2.5 rounded-xl transition border border-red-500/30 cursor-pointer"
                          title="Delete Advisor"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CONFIRMED VIEWING TOURS */}
          {activeTab === 'bookings' && (
            <div className="bg-[#0D121D] border border-white/10 p-8 rounded-3xl shadow-2xl">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                  <h2 className="text-xl font-serif flex items-center gap-2.5 text-white">
                    <Calendar size={20} className="text-amber-400" /> Confirmed Client-Agent Tours ({filteredBookings.length})
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">Manage private appointments, confirm/cancel, or permanently remove records.</p>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 text-xs font-semibold">
                  <span className="text-slate-400 flex items-center gap-1"><Filter size={14} className="text-amber-400" /> Filter:</span>
                  {['All', 'Confirmed', 'Pending', 'Cancelled'].map((status) => (
                    <button
                      key={status}
                      onClick={() => { setSelectedBookingStatus(status); setBookingsPage(1); }}
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
                  <Calendar size={36} className="mx-auto text-amber-400 mb-3 opacity-40" />
                  <p className="text-slate-400 text-xs">No tour bookings found.</p>
                </div>
              ) : (
                <>
                  <div className="space-y-5">
                    {currentBookings.map((tour) => {
                      const matchedProp = properties.find(p => p._id === tour.propertyId || p.title === tour.propertyTitle);
                      const matchedAgent = agents.find(ag => ag.email === tour.agentEmail || ag.name === tour.agentName);
                      const finalAgentName = tour.agentName || matchedProp?.agentName || matchedAgent?.name || 'Admin';
                      const finalAgentEmail = tour.agentEmail || matchedProp?.agentEmail || matchedAgent?.email || 'admin@gmail.com';
                      const finalAgentLocation = matchedAgent?.location || matchedProp?.location || 'Ahmedabad';

                      return (
                        <div key={tour._id} className="bg-black/40 border border-white/10 rounded-2xl p-6 shadow-xl hover:border-amber-500/30 transition-all">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                            <div>
                              <h3 className="text-lg font-serif font-bold text-white tracking-wide">
                                {tour.propertyTitle || matchedProp?.title || 'Luxury Residence'}
                              </h3>
                              <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mt-1">
                                <span>📅 Tour Scheduled:</span>
                                <strong className="text-amber-300">{tour.date} at {tour.time}</strong>
                              </p>
                            </div>

                            <div className="flex items-center gap-2.5">
                              <span className={`text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-lg border ${
                                tour.status === 'Cancelled' ? 'bg-red-500/10 text-red-400 border-red-500/30' : tour.status === 'Pending' ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                              }`}>
                                {tour.status ? `${tour.status.toUpperCase()} STATUS` : 'CONFIRMED STATUS'}
                              </span>

                              <button onClick={() => handleDeleteBooking(tour._id)} className="bg-red-500/15 hover:bg-red-500 border border-red-500/30 text-red-400 hover:text-white p-2 rounded-xl transition cursor-pointer">
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            <div className="bg-[#070A0F] border border-white/5 rounded-xl p-4 space-y-2.5">
                              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block mb-1">CLIENT DETAILS</span>
                              <p className="flex items-center gap-2 text-white font-medium"><User size={14} className="text-amber-400 shrink-0" /><span>Name: <strong className="text-white font-bold">{tour.userName || 'Client'}</strong></span></p>
                              <p className="flex items-center gap-2 text-white font-medium"><Mail size={14} className="text-amber-400 shrink-0" /><span>Email: <span className="text-white">{tour.userEmail}</span></span></p>
                              <p className="flex items-center gap-2 text-white font-medium"><Phone size={14} className="text-amber-400 shrink-0" /><span>Phone: <span className="text-white">{tour.phone}</span></span></p>
                            </div>

                            <div className="bg-[#070A0F] border border-white/5 rounded-xl p-4 space-y-2.5">
                              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">ASSIGNED AGENT</span>
                              <p className="flex items-center gap-2 text-white font-medium"><Building size={14} className="text-emerald-400 shrink-0" /><span>Name: <strong className="text-white font-bold">{finalAgentName}</strong></span></p>
                              <p className="flex items-center gap-2 text-white font-medium"><Mail size={14} className="text-emerald-400 shrink-0" /><span>Email: <span className="text-white">{finalAgentEmail}</span></span></p>
                              <p className="flex items-center gap-2 text-white font-medium"><MapPin size={14} className="text-emerald-400 shrink-0" /><span>Location: <span className="text-white">{finalAgentLocation}</span></span></p>
                            </div>
                          </div>

                          <div className="flex justify-end items-center gap-2 mt-4 pt-3 border-t border-white/5">
                            {tour.status !== 'Confirmed' && (
                              <button onClick={() => handleUpdateBookingStatus(tour._id, 'Confirmed')} className="bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-white px-3.5 py-1.5 rounded-xl text-xs uppercase tracking-wider font-bold transition flex items-center gap-1 border border-emerald-500/30 cursor-pointer">
                                <CheckCircle2 size={13} /> Confirm
                              </button>
                            )}
                            {tour.status !== 'Cancelled' && (
                              <button onClick={() => handleUpdateBookingStatus(tour._id, 'Cancelled')} className="bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white px-3.5 py-1.5 rounded-xl text-xs uppercase tracking-wider font-bold transition flex items-center gap-1 border border-red-500/30 cursor-pointer">
                                <XCircle size={13} /> Cancel
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {renderPagination(filteredBookings.length, bookingsPage, setBookingsPage)}
                </>
              )}
            </div>
          )}

          {/* TAB 3: CLIENT MEMBERS */}
          {activeTab === 'users' && (
            <div className="bg-[#0D121D] border border-white/10 p-8 rounded-3xl shadow-2xl">
              <h2 className="text-xl font-serif mb-8 flex items-center gap-2.5 text-white">
                <UserCheck size={20} className="text-amber-400" /> Registered Client Members ({usersList.length})
              </h2>

              {usersList.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl bg-[#070A0F]">
                  <User size={36} className="mx-auto text-amber-400 mb-3 opacity-40" />
                  <p className="text-slate-400 text-xs">No registered client members found.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {currentUsers.map((client) => (
                      <div key={client._id} className="bg-black/40 border border-white/5 p-6 rounded-2xl flex items-start justify-between gap-4 hover:border-amber-500/30 transition-all shadow-xl">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-400 font-serif text-xl shrink-0">
                            {client.name ? client.name.charAt(0).toUpperCase() : 'C'}
                          </div>
                          <div>
                            <h4 className="font-serif text-white text-sm font-semibold">{client.name}</h4>
                            <span className="text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 inline-block mt-1">
                              Client Member
                            </span>
                            <p className="text-xs text-slate-300 mt-2 flex items-center gap-1.5"><Mail size={12} className="text-amber-400" /> {client.email}</p>
                            {client.phone && <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5"><Phone size={12} className="text-amber-400" /> {client.phone}</p>}
                          </div>
                        </div>
                        <button onClick={() => handleDeleteUser(client._id)} className="bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white p-2.5 rounded-xl transition border border-red-500/30 cursor-pointer shrink-0">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                  {renderPagination(usersList.length, usersPage, setUsersPage)}
                </>
              )}
            </div>
          )}

          {/* TAB 4: ADD ESTATE (Bathroom removed, Bedroom converted to dropdown) */}
          {activeTab === 'add' && (
            <div className="bg-[#0D121D] border border-white/10 p-8 rounded-3xl shadow-2xl max-w-2xl mx-auto">
              <h2 className="text-xl font-serif mb-6 flex items-center gap-2.5 text-white">
                <PlusCircle size={20} className="text-amber-400" /> Publish Landmark Estate
              </h2>
              <form onSubmit={handleAddProperty} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">Estate Title</label>
                  <input type="text" name="title" required placeholder="Estate Title" value={formData.title} onChange={handleChange} className="w-full bg-[#070A0F] border border-white/10 rounded-2xl px-4 py-3 text-slate-200 placeholder-slate-500 focus:border-amber-400 focus:outline-none font-medium" />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">Prime Location</label>
                  <input type="text" name="location" required placeholder="Prime Location" value={formData.location} onChange={handleChange} className="w-full bg-[#070A0F] border border-white/10 rounded-2xl px-4 py-3 text-slate-200 placeholder-slate-500 focus:border-amber-400 focus:outline-none font-medium" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">Price ($M)</label>
                    <input type="number" step="0.1" name="price" required placeholder="Price ($M)" value={formData.price} onChange={handleChange} className="w-full bg-[#070A0F] border border-white/10 rounded-2xl px-4 py-3 text-slate-200 placeholder-slate-500 focus:border-amber-400 focus:outline-none font-medium" />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">Square Feet</label>
                    <input type="number" name="sqft" required placeholder="Square Feet" value={formData.sqft} onChange={handleChange} className="w-full bg-[#070A0F] border border-white/10 rounded-2xl px-4 py-3 text-slate-200 placeholder-slate-500 focus:border-amber-400 focus:outline-none font-medium" />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">Bedrooms (BHK)</label>
                  <select name="beds" value={formData.beds} onChange={handleChange} className="w-full bg-[#070A0F] border border-white/10 rounded-2xl px-4 py-3 text-slate-200 focus:border-amber-400 focus:outline-none font-medium cursor-pointer">
                    <option value="1">1 BHK</option>
                    <option value="2">2 BHK</option>
                    <option value="3">3 BHK</option>
                    <option value="4">4 BHK</option>
                    <option value="5">5+ BHK</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">Property Images</label>
                  <input type="file" name="images" accept="image/*" multiple required onChange={handleFileChange} className="w-full bg-[#070A0F] border border-white/10 rounded-2xl px-4 py-2 text-slate-400 file:mr-4 file:py-1 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-500 file:text-slate-950 cursor-pointer" />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">Description</label>
                  <textarea name="description" placeholder="Description..." value={formData.description} onChange={handleChange} className="w-full bg-[#070A0F] border border-white/10 rounded-2xl p-4 text-slate-200 placeholder-slate-500 focus:border-amber-400 focus:outline-none h-28 resize-none font-medium"></textarea>
                </div>

                <button type="submit" className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-3.5 rounded-2xl uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 shadow-lg">
                  <Upload size={15} /> Publish Estate
                </button>
              </form>
            </div>
          )}

          {/* TAB 5: ADVISORS DIRECTORY */}
          {activeTab === 'agents' && (
            <div className="bg-[#0D121D] border border-white/10 p-8 rounded-3xl shadow-2xl">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <h2 className="text-xl font-serif flex items-center gap-2.5 text-white">
                  <Users size={20} className="text-amber-400" /> Advisors Directory ({filteredAgents.length})
                </h2>

                <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 text-xs font-semibold">
                  <span className="text-slate-400 flex items-center gap-1"><Filter size={14} className="text-amber-400" /> Filter:</span>
                  {['All', 'Senior Luxury Specialist', 'Commercial Advisor', 'Residential Consultant'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => { setSelectedAgentCategory(cat); setAgentsPage(1); }}
                      className={`px-3.5 py-1.5 rounded-xl transition shrink-0 cursor-pointer ${
                        selectedAgentCategory === cat ? 'bg-amber-500 text-slate-950 font-bold shadow-md' : 'bg-[#070A0F] border border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {filteredAgents.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl bg-[#070A0F]">
                  <p className="text-slate-400 text-xs">No advisors found in this classification.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {currentAgents.map((ag) => (
                      <div key={ag.id} className="bg-black/40 border border-white/5 p-6 rounded-2xl flex items-start justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center text-amber-400 font-serif text-xl shrink-0">
                            {ag.photo ? <img src={ag.photo} alt={ag.name} className="w-full h-full object-cover" /> : (ag.name ? ag.name.charAt(0) : 'A')}
                          </div>
                          <div>
                            <h4 className="font-serif text-white text-sm">{ag.name}</h4>
                            <p className="text-xs text-amber-400 font-medium mt-0.5">{ag.designation}</p>
                            <p className="text-xs text-slate-400 mt-1">✉ {ag.email}</p>
                            <p className="text-xs text-slate-500">📞 {ag.phone} • 📍 {ag.location}</p>
                          </div>
                        </div>
                        <button onClick={() => handleDeleteAgent(ag.id)} className="bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white p-2.5 rounded-xl transition border border-red-500/30 cursor-pointer shrink-0">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                  {renderPagination(filteredAgents.length, agentsPage, setAgentsPage)}
                </>
              )}
            </div>
          )}

          {/* TAB 6: CONTACT INQUIRIES */}
          {activeTab === 'inquiries' && (
            <div className="bg-[#0D121D] border border-white/10 p-8 rounded-3xl shadow-2xl">
              <h2 className="text-xl font-serif mb-8 flex items-center gap-2.5 text-white">
                <MessageSquare size={20} className="text-amber-400" /> Client Consultations ({inquiries.length})
              </h2>
              {inquiries.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl bg-[#070A0F]">
                  <p className="text-slate-400 text-xs">No client inquiries received yet.</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {currentInquiries.map((inq) => (
                      <div key={inq._id} className="bg-black/40 border border-white/5 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <h4 className="font-serif text-white text-sm">{inq.name}</h4>
                            <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/30">{inq.email}</span>
                          </div>
                          {inq.phone && <p className="text-xs text-slate-500">📞 {inq.phone}</p>}
                          <p className="text-xs text-slate-300 mt-2 bg-[#070A0F] p-3 rounded-xl border border-white/5 font-light">"{inq.message}"</p>
                        </div>
                        <button onClick={() => handleDeleteInquiry(inq._id)} className="bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white p-3 rounded-xl transition border border-red-500/30 cursor-pointer shrink-0">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                  {renderPagination(inquiries.length, inquiriesPage, setInquiriesPage)}
                </>
              )}
            </div>
          )}

          {/* TAB 7: SUBSCRIBERS */}
          {activeTab === 'subscribers' && (
            <div className="bg-[#0D121D] border border-white/10 p-8 rounded-3xl shadow-2xl">
              <h2 className="text-xl font-serif mb-8 flex items-center gap-2.5 text-white">
                <Mail size={20} className="text-amber-400" /> Private Dispatch Subscribers ({subscribers.length})
              </h2>
              {subscribers.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl bg-[#070A0F]">
                  <p className="text-slate-400 text-xs">No subscribers registered yet.</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {currentSubscribers.map((sub) => (
                      <div key={sub._id} className="bg-black/40 border border-white/5 p-4 rounded-2xl flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-400 shrink-0">
                            <Mail size={16} />
                          </div>
                          <div>
                            <h4 className="font-serif text-white text-sm">{sub.email}</h4>
                            <p className="text-[10px] text-slate-500">Subscribed on: {new Date(sub.createdAt || Date.now()).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <button onClick={() => handleDeleteSubscriber(sub._id)} className="bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white p-3 rounded-xl transition border border-red-500/30 cursor-pointer">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                  {renderPagination(subscribers.length, subscribersPage, setSubscribersPage)}
                </>
              )}
            </div>
          )}

        </div>
      </main>

      {/* Property View Modal */}
      {viewingProperty && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0D121D] border border-white/10 rounded-3xl max-w-xl w-full p-8 relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <button onClick={() => setViewingProperty(null)} className="absolute top-6 right-6 bg-white/5 hover:bg-white/10 text-slate-300 p-2.5 rounded-full transition cursor-pointer">
              <X size={18} />
            </button>
            <h3 className="text-xl font-serif text-white mb-4">{viewingProperty.title}</h3>
            <img 
              src={viewingProperty.image && viewingProperty.image.startsWith('http') ? viewingProperty.image : `https://https://real-estate-5-hello.onrender.com${viewingProperty.image}`} 
              alt={viewingProperty.title} 
              className="w-full h-64 object-cover rounded-2xl mb-6 border border-white/10"
            />
            <div className="grid grid-cols-2 gap-4 text-xs mb-6 font-medium">
              <div className="bg-black/40 p-3.5 rounded-2xl border border-white/5">
                <span className="text-slate-500 block mb-1 text-[10px] uppercase">Location</span>
                <span className="text-slate-200">{viewingProperty.location}</span>
              </div>
              <div className="bg-black/40 p-3.5 rounded-2xl border border-white/5">
                <span className="text-slate-500 block mb-1 text-[10px] uppercase">Price</span>
                <span className="text-amber-400 font-serif">${viewingProperty.price}M</span>
              </div>
            </div>
            {viewingProperty.description && (
              <div className="text-xs">
                <span className="text-slate-500 block mb-1 text-[10px] uppercase">Description</span>
                <p className="text-slate-400 bg-black/40 p-4 rounded-2xl border border-white/5 leading-relaxed font-light">{viewingProperty.description}</p>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}