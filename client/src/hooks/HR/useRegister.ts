import { useState } from 'react';
import { register } from '../../services/HR/auth';

export const useRegister = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVerify, setPasswordVerify] = useState('');

  const [firstNameError, setFirstNameError] = useState<string | null>(null);
  const [lastNameError, setLastNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordVerifyError, setPasswordVerifyError] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (
    firstName: string,
    lastName: string,
    password: string,
    passwordVerify: string,
    emailAddress: string,
    admin: number
  ) => {
    const response = await register(
      firstName,
      lastName,
      password,
      passwordVerify,
      emailAddress,
      admin
    );
    if (response.error) {
      setError(response.error);
    } else {
      setSuccess('User registered successfully');
      setError('');
    }
  };

  const validateAndRegister = () => {
    let hasError = false;

    if (!firstName.trim()) {
      setFirstNameError('First name cannot be empty');
      hasError = true;
    } else {
      setFirstNameError(null);
    }

    if (!lastName.trim()) {
      setLastNameError('Last name cannot be empty');
      hasError = true;
    } else {
      setLastNameError(null);
    }

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

    if (!passwordVerify.trim()) {
      setPasswordVerifyError('Confirm password cannot be empty');
      hasError = true;
    } else if (password !== passwordVerify) {
      setPasswordVerifyError('Passwords do not match');
      hasError = true;
    } else {
      setPasswordVerifyError(null);
    }

    if (!hasError) {
      handleRegister(firstName, lastName, password, passwordVerify, emailAddress, 1);
    }
  };

  return {
    handleRegister,
    error,
    success,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    emailAddress,
    setEmailAddress,
    password,
    setPassword,
    passwordVerify,
    setPasswordVerify,
    firstNameError,
    setFirstNameError,
    lastNameError,
    setLastNameError,
    emailError,
    setEmailError,
    passwordError,
    setPasswordError,
    passwordVerifyError,
    setPasswordVerifyError,
    validateAndRegister,
  };
};
