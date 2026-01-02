import axios from 'axios';

const api = axios.create({
  /**
   * Use the Environment Variable set in Vercel.
   * On your local computer, it will automatically fall back to localhost.
   * IMPORTANT: Do not put a "/" at the end of your URL in Vercel settings.
   */
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000', 
});

api.interceptors.request.use((config) => {
  /**
   * Next.js Fix:
   * We must check if 'window' exists. This ensures the code only tries to
   * access localStorage when running in the browser, preventing server-side crashes.
   */
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;