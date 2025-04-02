import { getAccessToken, getTokenExpiry, isTokenExpired, removeAccessToken, setAccessToken } from '../utils/tokenStorage';
import { login as apiLogin, LoginCredentials } from '../api/authApi';

/**
 * Authentication service for managing user authentication state
 */
const authService = {
  /**
   * Login user with username and password
   */
  async login(credentials: LoginCredentials): Promise<string> {
    try {
      const response = await apiLogin(credentials);
      const token = response.access_token;
      
      // Store token with expiry
      setAccessToken(token, response.expires_in);
      
      return token;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },
  
  /**
   * Logout user by removing access token
   */
  logout(): void {
    removeAccessToken();
  },
  
  /**
   * Check if user is authenticated with valid token
   */
  isAuthenticated(): boolean {
    const token = getAccessToken();
    if (!token) return false;
    
    return !isTokenExpired();
  },
  
  /**
   * Get authentication token
   */
  getToken(): string | null {
    return getAccessToken();
  },
  
  /**
   * Get token expiry timestamp
   */
  getTokenExpiry(): number | null {
    return getTokenExpiry();
  },
  
  /**
   * Get remaining token validity time in seconds
   */
  getTokenRemainingTime(): number {
    const expiry = this.getTokenExpiry();
    if (!expiry) return 0;
    
    const remaining = expiry - Date.now();
    return Math.max(0, Math.floor(remaining / 1000));
  }
};

export default authService;
