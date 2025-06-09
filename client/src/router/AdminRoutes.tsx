import { lazy, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import '../styles/global.css';

import PublicUserRoutes from '../routes/PublicUserRoutes';
import ProtectedUserRoutes from '../routes/ProtectedUserRoutes';

const Login = lazy(() => import('../pages/HR/Login/Login'));
const SignUp = lazy(() => import('../pages/HR/SignUp/SignUp'));
const AdminLayout = lazy(() => import('../pages/HR/AdminLayout/AdminLayout'));
const AdminReservation = lazy(() => import('../pages/HR/Reservation/Reservation'));
const Attendance = lazy(() => import('../pages/HR/Attendance/Attendance'));
const Settings = lazy(() => import('../pages/HR/Settings/Settings'));
const Help = lazy(() => import('../pages/HR/Help/Help'));

export default function AdminRoutes() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/adm/login"
          element={
            <PublicUserRoutes>
              <Login />
            </PublicUserRoutes>
          }
        />
        <Route
          path="/adm/*"
          element={
            <ProtectedUserRoutes>
              <AdminLayout />
            </ProtectedUserRoutes>
          }
        >
          <Route path="settings/add-admin" element={<SignUp />} />
          <Route path="restaurant-config" element={<AdminReservation />} />
          <Route path="reservations" element={<Attendance />} />
          <Route path="settings" element={<Settings />} />
          <Route path="help" element={<Help />} />
          <Route path="*" element={<Navigate to="/adm/login" replace />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}
