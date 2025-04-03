import { getAccessToken, getTokenExpiry, isTokenExpired, removeAccessToken, setAccessToken } from '../utils/tokenStorage';
import { login as apiLogin, LoginCredentials } from '../api/authApi';

const authService = {
  async login(credentials: LoginCredentials): Promise<string> {
    try {
      const response = await apiLogin(credentials);
      const token = response.access_token;

      setAccessToken(token, response.expires_in);
      
      return token;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },
  
  logout(): void {
    removeAccessToken();
  },
  
  isAuthenticated(): boolean {
    const token = getAccessToken();
    if (!token) return false;
    
    return !isTokenExpired();
  },
  
  getToken(): string | null {
    return getAccessToken();
  },
  
  getTokenExpiry(): number | null {
    return getTokenExpiry();
  },
  
  getTokenRemainingTime(): number {
    const expiry = this.getTokenExpiry();
    if (!expiry) return 0;
    
    const remaining = expiry - Date.now();
    return Math.max(0, Math.floor(remaining / 1000));
  }
};

export default authService;
