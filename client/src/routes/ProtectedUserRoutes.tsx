import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { verifyUserToken } from '../services/HR/auth';

const ProtectedUserRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await verifyUserToken();
        if (response.error) {
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error verifying token:', error);
        setIsAuthenticated(false);
      }
    };

    verifyToken();
  }, []);

  if (isAuthenticated === null) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/adm/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedUserRoute;
