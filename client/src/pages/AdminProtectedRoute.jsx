import { Navigate, Outlet } from 'react-router-dom';

export default function AdminProtectedRoute() {
  // localStorage चेक करें ताकि नया टैब या डायरेक्ट URL पर भी डेटा मिले
  const isAdminAuth = localStorage.getItem('isAdminLoggedIn') === 'true';

  return isAdminAuth ? <Outlet /> : <Navigate to="/admin-login" replace />;
}