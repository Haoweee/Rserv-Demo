import { lazy, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import '../styles/global.css';

import PublicReservationRoutes from '../routes/PublicReservationRoutes';
import ProtectedReservationRoutes from '../routes/ProtectedReservationRoutes';
import WithStripeScript from '../routes/WithStripe';

// Policy Pages
const TermsConditions = lazy(() => import('../pages/Reservation/Policies/TermsConditions'));

// User access routes
const UserLayout = lazy(() => import('../pages/Reservation/UserLayout/UserLayout'));
const ReservationLogin = lazy(() => import('../pages/Reservation/Login/ReservationLogin'));
const Reservation = lazy(() => import('../pages/Reservation/Reservation/Reservation'));
const ReservationPayment = lazy(() => import('../pages/Reservation/Payment/Payment'));
const ReservationConfirmation = lazy(
  () => import('../pages/Reservation/Confirmation/Confirmation')
);

export default function UserRoutes() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/terms-conditions" element={<TermsConditions />} />
        <Route
          path="/"
          element={
            <PublicReservationRoutes>
              <WithStripeScript>
                <ReservationLogin />
              </WithStripeScript>
            </PublicReservationRoutes>
          }
        />
        <Route
          path="/"
          element={
            <WithStripeScript>
              <ProtectedReservationRoutes>
                <UserLayout />
              </ProtectedReservationRoutes>
            </WithStripeScript>
          }
        >
          <Route path="reservation" element={<Reservation />} />
          <Route path="deposit" element={<ReservationPayment />} />
        </Route>
        <Route path="/confirmation" element={<ReservationConfirmation />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}
