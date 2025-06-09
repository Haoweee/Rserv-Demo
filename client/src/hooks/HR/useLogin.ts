import { useState } from 'react';
import { login } from '../../services/HR/auth';
import { useNavigate } from 'react-router-dom';

export const useLogin = () => {
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (emailAddress: string, password: string) => {
    const response = await login(emailAddress, password);
    if (response.error) {
      setError(response.error);
    } else {
      setError('');
      navigate('/adm/attendance');
    }
  };

  const validateAndLogin = () => {
    let hasError = false;

    if (!emailAddress.trim()) {
      setEmailError('Email address cannot be empty');
      hasError = true;
    } else {
      setEmailError(null);
    }

    if (!password.trim()) {
      setPasswordError('Password cannot be empty');
      hasError = true;
    } else {
      setPasswordError(null);
    }

    if (!hasError) {
      handleLogin(emailAddress, password);
    }
  };

  return {
    validateAndLogin,
    error,
    emailAddress,
    setEmailAddress,
    password,
    setPassword,
    emailError,
    passwordError,
  };
};
