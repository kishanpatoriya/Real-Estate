import { Navigate, Outlet } from 'react-router-dom';

export default function AdminProtectedRoute() {
  // Yahan bhi localStorage ki jagah sessionStorage check karein
  const isAdminAuth = sessionStorage.getItem('isAdminLoggedIn') === 'true';
  return isAdminAuth ? <Outlet /> : <Navigate to="/admin-login" replace />;
}