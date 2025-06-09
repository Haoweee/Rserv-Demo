import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { verifyReservationToken } from '../services/Reservation/auth';

const PublicRoutes = ({ children }: { children: React.ReactNode }) => {
  const [userAuthenticated, setuserAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await verifyReservationToken();
        if (response.error) {
          setuserAuthenticated(false);
        } else {
          setuserAuthenticated(true);
        }
      } catch {
        setuserAuthenticated(false);
      }
    };

    checkAuthentication();
  }, []);

  if (userAuthenticated === null) {
    return null;
  }

  if (userAuthenticated) {
    return <Navigate to="/reservation" replace />;
  }

  return <>{children}</>;
};

export default PublicRoutes;
