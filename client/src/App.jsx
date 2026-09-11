import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import AdminProtectedRoute from './pages/AdminProtectedRoute';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import AgentProfile from './pages/AgentProfile';
import AgentPlans from './pages/AgentPlans'; // Added AgentPlans Component
import UserProfile from './pages/UserProfile';
import Agents from './pages/Agents';
import AgentDetails from './pages/AgentDetails';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer';
import './App.css';

function App() {
  const location = useLocation();
  const isAdminSection = location.pathname.startsWith('/admin');
  const isAgentSection = location.pathname === '/agent-dashboard';
  const isLoginSection = 
    location.pathname === '/login' || 
    location.pathname === '/register' || 
    location.pathname === '/admin-login' || 
    location.pathname === '/adminlogin';
  
  const hideHeaderFooter = isAdminSection || isAgentSection || isLoginSection;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {!hideHeaderFooter && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/properties/:id" element={<PropertyDetails />} />

        {/* Agents Listing & Single Agent Details Routes */}
        <Route path="/agents" element={<Agents />} />
        <Route path="/agents/:id" element={<AgentDetails />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User & Agent Profiles & Plans */}
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/agent-profile" element={<AgentProfile />} />
        <Route path="/agent-plans" element={<AgentPlans />} />

        {/* Admin Routes - Supports both /admin-login and /adminlogin */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/adminlogin" element={<AdminLogin />} />

        <Route element={<AdminProtectedRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {!hideHeaderFooter && <Footer />}
    </div>
  );
}

export default App;