import { paths } from 'src/routes/paths';

import { STORAGE_ROLE_KEY, STORAGE_TOKEN_KEY } from 'src/consts';
// ----------------------------------------------------------------------

function jwtDecode(token: string) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join('')
  );

  return JSON.parse(jsonPayload);
}

// ----------------------------------------------------------------------

export const isValidToken = (token: string) => {
  if (!token) {
    return false;
  }

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch {
    return false;
  }
};

// ----------------------------------------------------------------------

export const setTokenTimer = (token: string): NodeJS.Timeout | null => {
  try {
    const { exp } = jwtDecode(token);
    const currentTime = Date.now();
    const timeLeft = exp * 1000 - currentTime;

    // if it exceeds setTimeout's maximum limit, don't create timer
    if (timeLeft >= 2147483647 || timeLeft <= 0) {
      return null;
    }

    return setTimeout(() => {
      // Clear storage and redirect
      localStorage.removeItem(STORAGE_TOKEN_KEY);
      localStorage.removeItem(STORAGE_ROLE_KEY);

      window.location.href = paths.auth.merchantLogin;
    }, timeLeft);
  } catch {
    return null;
  }
};

// ----------------------------------------------------------------------

export const setToken = (token: string | null) => {
  if (token) {
    localStorage.setItem(STORAGE_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    localStorage.removeItem(STORAGE_ROLE_KEY);
  }
};

// ----------------------------------------------------------------------

export const getStoredRole = (): string | null => localStorage.getItem(STORAGE_ROLE_KEY);
