const API_URL = process.env.REACT_APP_API_URL;

export const register = async (
  firstName: string,
  lastName: string,
  password: string,
  passwordVerify: string,
  emailAddress: string,
  admin: number
) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName,
        lastName,
        password,
        passwordVerify,
        emailAddress,
        admin,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }

    return response.json();
  } catch (error: any) {
    return { isAuthenticated: false, error: error.message };
  }
};

export const login = async (emailAddress: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ emailAddress, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    return response.json();
  } catch (error: any) {
    return { isAuthenticated: false, error: error.message };
  }
};

export const logoutAPI = async () => {
  const response = await fetch(`${API_URL}/logout`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to log out');
  }
};

export const verifyUserToken = async () => {
  try {
    const response = await fetch(`${API_URL}/auth/verifyUserToken`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Not authenticated');
    }

    return response.json();
  } catch (error: any) {
    return { error: error.message };
  }
};
