const API_URL = process.env.REACT_APP_API_URL;

export interface LoginResponse {
  success?: boolean;
  message?: string;
  error?: string;
}

export interface VerifyLoginCodeResponse {
  success?: boolean;
  isAuthenticated?: boolean;
  role?: 'user';
  errorMessage?: string;
}

export interface UserData {
  isAuthenticated: boolean;
  role: 'user';
}

export const login = async (phoneNumber: string) => {
  try {
    const response = await fetch(`${API_URL}/send2FA`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phoneNumber }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    return response.json();
  } catch (error: any) {
    return { error: error.message };
  }
};

export const verifyLoginCode = async (phoneNumber: string, accessCode: string) => {
  try {
    const response = await fetch(`${API_URL}/validate2FA`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phoneNumber, accessCode }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    return response.json();
  } catch (error: any) {
    return { error: error.message };
  }
};

export const navigateToHome = async () => {
  try {
    const response = await fetch(`${API_URL}/clearResToken`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Could not navigate back to home');
    }

    return response.json();
  } catch (error: any) {
    return { error: error.message };
  }
};

export const verifyReservationToken = async () => {
  try {
    const response = await fetch(`${API_URL}/auth/verifyReservationToken`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to verify reservation token');
    }

    return response.json();
  } catch (error: any) {
    return { error: error.message };
  }
};
