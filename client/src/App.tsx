import { Suspense } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import UserRoutes from './router/UserRoutes';
import AdminRoutes from './router/AdminRoutes';
import Background from './components/Background/Background';
import Loading from './components/Loading/Loading';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/adm');

  return (
    <>
      {!isAdminRoute && <Background />}
      {isAdminRoute ? <AdminRoutes /> : <UserRoutes />}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <AppContent />
      </Suspense>
    </Router>
  );
}
