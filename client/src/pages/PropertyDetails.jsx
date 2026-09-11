import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Bed, Bath, Square, ArrowLeft, Calendar, Clock, User, Phone, Mail, ShieldCheck, X, Maximize2 } from 'lucide-react';

export default function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [modalImage, setModalImage] = useState(null);
  
  const [agentInfo, setAgentInfo] = useState({
    name: sessionStorage.getItem('name') || localStorage.getItem('name') || 'Kishan Patoriya',
    phone: sessionStorage.getItem('phone') || localStorage.getItem('phone') || '+91 98765 43210',
    email: sessionStorage.getItem('email') || localStorage.getItem('email') || 'agent@gharsetu.com',
    designation: sessionStorage.getItem('designation') || localStorage.getItem('designation') || 'Senior Luxury Specialist'
  });

  const [bookingData, setBookingData] = useState({
    userName: '',
    userEmail: '',
    phone: '',
    date: '',
    time: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchPropertyDetails();

    // 👉 Logged in user details automatically fill (fetch) karne ke liye
    const storedName = sessionStorage.getItem('name') || localStorage.getItem('name') || '';
    const storedEmail = sessionStorage.getItem('email') || localStorage.getItem('email') || '';
    const storedPhone = sessionStorage.getItem('phone') || localStorage.getItem('phone') || '';

    setBookingData(prev => ({
      ...prev,
      userName: storedName,
      userEmail: storedEmail,
      phone: storedPhone.replace('+91', '').trim()
    }));
  }, [id]);

  const fetchPropertyDetails = async () => {
    try {
      const res = await axios.get(`https://real-estate-5-hello.onrender.com/api/properties`);
      const found = res.data.find(p => p._id === id);
      setProperty(found);
      if (found) {
        const primaryImg = found.image 
          ? (found.image.startsWith('http') ? found.image : `https://real-estate-1azb.onrender.com${found.image}`)
          : (found.images && found.images.length > 0 ? (found.images[0].startsWith('http') ? found.images[0] : `https://real-estate-1azb.onrender.com${found.images[0]}`) : '');
        setActiveImage(primaryImg);
        if (found.agentName) {
          setAgentInfo(prev => ({
            ...prev,
            name: found.agentName,
            email: found.agentEmail || prev.email
          }));
        }
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching property details:", err);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const numericValue = value.replace(/\D/g, '');
      if (numericValue.length <= 10) {
        setBookingData({ ...bookingData, [name]: numericValue });
      }
    } else {
      setBookingData({ ...bookingData, [name]: value });
    }

    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateBooking = () => {
    let tempErrors = {};
    if (!bookingData.userName.trim()) tempErrors.userName = 'Name is required.';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!bookingData.userEmail.trim()) {
      tempErrors.userEmail = 'Email is required.';
    } else if (!emailRegex.test(bookingData.userEmail)) {
      tempErrors.userEmail = 'Please enter a valid email address.';
    }

    if (!bookingData.phone.trim()) {
      tempErrors.phone = 'Phone number is required.';
    } else if (bookingData.phone.length !== 10) {
      tempErrors.phone = 'Phone number must be exactly 10 digits.';
    }

    if (!bookingData.date) tempErrors.date = 'Date is required.';
    if (!bookingData.time) tempErrors.time = 'Time is required.';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (validateBooking()) {
      try {
        await axios.post('https://real-estate-5-hello.onrender.com/api/bookings', {
          ...bookingData,
          propertyId: id,
          propertyTitle: property.title,
          agentName: agentInfo.name,
          agentEmail: agentInfo.email,
          userEmail: bookingData.userEmail
        });
        alert('Private viewing request submitted successfully! An acquisitions director will contact you.');
        
        // Form submit hone ke baad reset (user info retained)
        const storedName = sessionStorage.getItem('name') || localStorage.getItem('name') || '';
        const storedEmail = sessionStorage.getItem('email') || localStorage.getItem('email') || '';
        const storedPhone = sessionStorage.getItem('phone') || localStorage.getItem('phone') || '';
        
        setBookingData({ 
          userName: storedName, 
          userEmail: storedEmail, 
          phone: storedPhone.replace('+91', '').trim(), 
          date: '', 
          time: '' 
        });
      } catch (err) {
        alert('Failed to submit viewing request.');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070A0F] text-amber-400 flex items-center justify-center font-sans">
        <p className="text-xs uppercase font-extrabold tracking-[0.25em] animate-pulse">Loading Luxury Estate...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-[#070A0F] text-slate-400 flex items-center justify-center font-sans">
        <p className="text-xs font-semibold">Estate dossier not found.</p>
      </div>
    );
  }

  const propertyImages = property.images && property.images.length > 0 
    ? property.images.map(img => img.startsWith('http') ? img : `https://real-estate-1azb.onrender.com${img}`)
    : [activeImage, activeImage, activeImage];

  return (
    <div className="min-h-screen bg-[#070A0F] text-slate-100 px-6 lg:px-16 pt-36 pb-24 font-sans selection:bg-amber-400 selection:text-slate-950">
      
      {/* Full-Screen Image Lightbox Modal */}
      {modalImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4">
          <button 
            onClick={() => setModalImage(null)}
            className="absolute top-6 right-6 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full border border-white/20 transition shadow-2xl z-50 cursor-pointer"
          >
            <X size={20} />
          </button>
          <div className="max-w-6xl max-h-[95vh] overflow-hidden rounded-3xl border border-white/10 shadow-2xl p-2 bg-[#0D121D]">
            <img src={modalImage} alt="Fullscreen View" className="w-full h-full object-contain max-h-[85vh] rounded-2xl" />
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <Link to="/properties" className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 mb-8 hover:text-amber-300 transition uppercase tracking-widest">
          <ArrowLeft size={16} /> Back to Portfolio
        </Link>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Column: Images & Features */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Main Image Viewer */}
            <div className="space-y-4">
              <div 
                onClick={() => setModalImage(activeImage)}
                className="rounded-3xl overflow-hidden border border-white/10 h-[460px] shadow-2xl relative group cursor-pointer bg-[#0D121D]"
              >
                <img 
                  src={activeImage} 
                  alt={property.title} 
                  className="w-full h-full object-cover transition duration-700 group-hover:scale-105 brightness-95" 
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                  <span className="bg-[#070A0F]/90 backdrop-blur-md text-amber-300 text-xs font-semibold px-4 py-2 rounded-xl border border-amber-500/30 flex items-center gap-2 shadow-2xl uppercase tracking-wider">
                    <Maximize2 size={14} /> Fullscreen Dossier
                  </span>
                </div>
                <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-4 py-1.5 rounded-full border border-amber-500/30 text-[10px] font-extrabold uppercase tracking-widest text-amber-300 shadow-md">
                  Exclusive Representation
                </div>
              </div>

              {/* Thumbnail Row */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                {propertyImages.map((img, index) => (
                  <div 
                    key={index} 
                    onClick={() => setActiveImage(img)}
                    className={`rounded-2xl overflow-hidden border h-24 cursor-pointer transition-all duration-300 relative group bg-[#0D121D] ${
                      activeImage === img ? 'border-amber-400 ring-2 ring-amber-400/20 shadow-lg' : 'border-white/10 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Property Overview Card */}
            <div className="bg-[#0D121D] border border-white/10 p-8 md:p-10 rounded-3xl shadow-2xl">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                  <p className="text-amber-400 text-xs font-semibold mb-1.5 flex items-center gap-1.5 uppercase tracking-wider">
                    <MapPin size={14} /> {property.location}
                  </p>
                  <h1 className="text-3xl font-serif text-white">{property.title}</h1>
                </div>
                <span className="text-2xl font-serif text-amber-300 bg-black/50 border border-amber-500/30 px-6 py-2.5 rounded-2xl shadow-xl">
                  ${property.price}M
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 py-6 border-y border-white/10 text-center text-xs font-medium text-slate-300 mb-8">
                <div className="flex items-center justify-center gap-2"><Bed size={16} className="text-amber-400" /> {property.beds} Bedrooms</div>
                <div className="flex items-center justify-center gap-2 border-x border-white/10"><Bath size={16} className="text-amber-400" /> {property.baths} Bathrooms</div>
                <div className="flex items-center justify-center gap-2"><Square size={16} className="text-amber-400" /> {property.sqft} sqft</div>
              </div>

              <h3 className="text-xs font-serif text-white mb-3 tracking-widest uppercase font-bold">Architectural Summary</h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-8 font-light">
                {property.description || "An architectural masterpiece designed with premium high-end finishes, panoramic views, ultimate privacy, and world-class luxury living spaces crafted for elite homeowners."}
              </p>

              {/* LISTING AGENT CONTACT INFO BOX */}
              <div className="bg-black/40 border border-white/5 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-amber-500/30 flex items-center justify-center text-amber-400 font-serif text-lg">
                    {agentInfo.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-serif text-white text-sm">{agentInfo.name}</h4>
                    <p className="text-[11px] text-amber-400 font-medium">{agentInfo.designation}</p>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5"><Phone size={12} className="text-amber-400" /> {agentInfo.phone}</p>
                  </div>
                </div>
                <a href={`tel:${agentInfo.phone}`} className="bg-white/5 hover:bg-amber-400 text-slate-200 hover:text-slate-950 text-xs font-bold px-5 py-2.5 rounded-xl uppercase tracking-wider transition flex items-center gap-1.5 border border-white/10 hover:border-transparent">
                  <Phone size={14} /> Contact Advisor
                </a>
              </div>
            </div>

          </div>

          {/* Right Column: Booking Form */}
          <div className="lg:col-span-1">
            <div className="bg-[#0D121D] border border-white/10 p-8 rounded-3xl shadow-2xl sticky top-32">
              <h3 className="text-base font-serif text-white mb-2 flex items-center gap-2">
                <Calendar size={16} className="text-amber-400" /> Private Walkthrough
              </h3>
              <p className="text-slate-400 text-xs mb-6 font-light leading-relaxed">
                Schedule a confidential, guided executive tour arranged around your personal itinerary.
              </p>
              
              <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs" noValidate>
                <div>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 text-slate-500" size={14} />
                    <input 
                      type="text" 
                      name="userName"
                      placeholder="Your Full Name" 
                      value={bookingData.userName} 
                      onChange={handleChange} 
                      className={`w-full bg-[#070A0F] border ${errors.userName ? 'border-red-500' : 'border-white/10'} rounded-2xl pl-11 pr-4 py-3 text-slate-200 placeholder-slate-600 focus:border-amber-400 focus:outline-none transition font-medium`} 
                    />
                  </div>
                  {errors.userName && <p className="text-red-400 text-[11px] mt-1 ml-2">{errors.userName}</p>}
                </div>

                <div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 text-slate-500" size={14} />
                    <input 
                      type="email" 
                      name="userEmail"
                      placeholder="Email Address" 
                      value={bookingData.userEmail} 
                      onChange={handleChange} 
                      className={`w-full bg-[#070A0F] border ${errors.userEmail ? 'border-red-500' : 'border-white/10'} rounded-2xl pl-11 pr-4 py-3 text-slate-200 placeholder-slate-600 focus:border-amber-400 focus:outline-none transition font-medium`} 
                    />
                  </div>
                  {errors.userEmail && <p className="text-red-400 text-[11px] mt-1 ml-2">{errors.userEmail}</p>}
                </div>

                <div>
                  <div className="relative">
                    <Phone className="absolute left-4 top-3.5 text-slate-500" size={14} />
                    <input 
                      type="tel" 
                      name="phone"
                      placeholder="Phone (10 Digits)" 
                      maxLength="10"
                      value={bookingData.phone} 
                      onChange={handleChange} 
                      className={`w-full bg-[#070A0F] border ${errors.phone ? 'border-red-500' : 'border-white/10'} rounded-2xl pl-11 pr-4 py-3 text-slate-200 placeholder-slate-600 focus:border-amber-400 focus:outline-none transition font-medium`} 
                    />
                  </div>
                  {errors.phone && <p className="text-red-400 text-[11px] mt-1 ml-2">{errors.phone}</p>}
                </div>

                {/* Date & Time Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-3.5 text-amber-400 pointer-events-none" size={15} />
                    <input 
                      type="date" 
                      name="date"
                      value={bookingData.date} 
                      onChange={handleChange} 
                      className={`w-full bg-[#070A0F] border ${errors.date ? 'border-red-500' : 'border-white/10'} rounded-2xl pl-10 pr-3 py-3 text-slate-200 focus:border-amber-400 focus:outline-none font-medium`} 
                    />
                  </div>
                  
                  <div className="relative">
                    <Clock className="absolute left-3.5 top-3.5 text-amber-400 pointer-events-none" size={15} />
                    <input 
                      type="time" 
                      name="time"
                      value={bookingData.time} 
                      onChange={handleChange} 
                      className={`w-full bg-[#070A0F] border ${errors.time ? 'border-red-500' : 'border-white/10'} rounded-2xl pl-10 pr-3 py-3 text-slate-200 focus:border-amber-400 focus:outline-none font-medium`} 
                    />
                  </div>
                </div>

                <button type="submit" className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-3.5 rounded-2xl text-xs uppercase tracking-widest transition shadow-xl mt-3 flex items-center justify-center gap-2 cursor-pointer">
                  <ShieldCheck size={16} /> Confirm Private Tour
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}