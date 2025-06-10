import { useState } from 'react';
import {
  login,
  verifyLoginCode,
  LoginResponse,
  VerifyLoginCodeResponse,
} from '../../services/Reservation/auth';

export const useLogin = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [reserveFormOpen, setReserveFormOpen] = useState<boolean>(false);
  const [loginCodeRequested, setLoginCodeRequested] = useState<boolean>(false);
  const [loginCode, setLoginCode] = useState<string>('');
  const [phoneNumberError, setPhoneNumberError] = useState<string | null>(null);
  const [loginCodeError, setLoginCodeError] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleOpenReserveForm = () => {
    setReserveFormOpen(true);
  };

  const handleLogin = async (
    phoneNumber: string,
    loginCodeRequested: boolean,
    setCodeRequested: () => void,
    loginCode: string,
    success: (shouldNavigate: boolean) => void
  ) => {
    if (!loginCodeRequested) {
      const response: LoginResponse = await login(phoneNumber);

      if (response.error) {
        setError(response.error);
      } else {
        setError('');
        setCodeRequested();
      }
    } else {
      const result: VerifyLoginCodeResponse = await verifyLoginCode(phoneNumber, loginCode);
      if (result.success) {
        success(true);
      } else {
        setError(result.errorMessage || 'Login failed. Please try again.');
        success(false);
      }
    }
  };

  const handlePhoneNumberChange = (number: string) => {
    setPhoneNumber(number);
    setPhoneNumberError(null);
  };

  const handleRequestLoginCode = () => {
    if (!phoneNumber.trim()) {
      setPhoneNumberError('Please enter a valid phone number');
    } else {
      setPhoneNumberError(null);
      setLoginCodeRequested(true);
    }
  };

  const validateAndLoginWithResult = (): Promise<boolean> => {
    return new Promise(resolve => {
      let hasError = false;

      if (!phoneNumber.trim()) {
        setPhoneNumberError('Please enter a valid phone number');
        hasError = true;
      } else {
        setPhoneNumberError(null);
      }

      if (loginCodeRequested && !loginCode.trim()) {
        setLoginCodeError('Verification code cannot be empty');
        hasError = true;
      } else {
        setLoginCodeError(null);
      }

      if (!hasError) {
        handleLogin(
          phoneNumber,
          loginCodeRequested,
          handleRequestLoginCode,
          loginCode,
          (success: boolean) => {
            resolve(success);
          }
        );
      } else {
        resolve(false);
      }
    });
  };

  const closeReserveForm = () => {
    setReserveFormOpen(false);
  };

  return {
    handlePhoneNumberChange,
    handleOpenReserveForm,
    reserveFormOpen,
    closeReserveForm,
    validateAndLoginWithResult,
    phoneNumber,
    loginCodeRequested,
    loginCode,
    setLoginCode,
    phoneNumberError,
    loginCodeError,
    error,
  };
};
