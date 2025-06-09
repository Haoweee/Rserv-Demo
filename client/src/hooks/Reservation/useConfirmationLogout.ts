import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useReservationLogout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handlePopState = () => {
      navigate('/', { replace: true });
    };

    // Listen for the back button click
    window.addEventListener('popstate', handlePopState);

    window.history.pushState(null, '', window.location.href);

    // Redirect to "/" after a timer (10 seconds)
    const timer = setTimeout(() => {
      navigate('/', { replace: true });
    }, 10000);

    return () => {
      // Cleanup the event listener and timer
      window.removeEventListener('popstate', handlePopState);
      clearTimeout(timer);
    };
  }, [navigate]);
};
