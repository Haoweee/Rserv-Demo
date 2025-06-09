import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { verifyUserToken } from '../services/HR/auth';

const PublicRoutes = ({ children }: { children: React.ReactNode }) => {
  const [userAuthenticated, setuserAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await verifyUserToken();
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
    return <Navigate to="/adm/reservations" replace />;
  }

  return <>{children}</>;
};

export default PublicRoutes;
