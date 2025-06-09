import { useNavigate } from 'react-router-dom';
import { logoutAPI } from '../../services/HR/auth';

export const useLogout = () => {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await logoutAPI();
      navigate('/adm/login');
    } catch (error) {
      console.error('Logout failed: ', error);
    }
  };

  return { logout };
};
