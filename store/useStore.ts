import { create } from 'zustand';

interface AuthState {
  token: string | null;
  isAdmin: boolean;
  setToken: (token: string | null) => void;
  logout: () => void;
}

/**
 * Helper to decode the JWT token directly in the browser.
 * This avoids making extra API calls to the backend just to check roles.
 */
const parseJwt = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

export const useAuth = create<AuthState>((set) => ({
  // Initialize with null to prevent Next.js hydration errors
  token: null,
  isAdmin: false,

  setToken: (token) => {
    if (token) {
      localStorage.setItem('token', token);
      const decoded = parseJwt(token);
      
      set({ 
        token, 
        // Sync the isAdmin state with the backend token value
        isAdmin: decoded?.is_admin || false 
      });
    } else {
      localStorage.removeItem('token');
      set({ token: null, isAdmin: false });
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, isAdmin: false });
    // Force a redirect to login for security
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }
}));

/**
 * RE-HYDRATION LOGIC:
 * This runs as soon as the file loads on the client side.
 * It checks if a user was already logged in and restores their session.
 */
if (typeof window !== 'undefined') {
  const savedToken = localStorage.getItem('token');
  if (savedToken) {
    const decoded = parseJwt(savedToken);
    
    // Check if token is expired (Optional but professional)
    const currentTime = Date.now() / 1000;
    if (decoded?.exp && decoded.exp < currentTime) {
      localStorage.removeItem('token');
    } else {
      useAuth.setState({ 
        token: savedToken, 
        isAdmin: decoded?.is_admin || false 
      });
    }
  }
}