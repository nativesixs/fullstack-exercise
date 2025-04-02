import * as tokenStorage from '../../utils/tokenStorage';
import configureStore from 'redux-mock-store';

jest.mock('../../api/authApi');
jest.mock('../../utils/tokenStorage');

const mockStore = configureStore([]);

describe('Auth Actions', () => {
  let store: any;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    store = mockStore({
      auth: {
        isAuthenticated: false,
        loading: false,
        error: null
      }
    });
    
    (tokenStorage.setAccessToken as jest.Mock).mockImplementation(() => {});
    (tokenStorage.removeAccessToken as jest.Mock).mockImplementation(() => {});
  });

  describe('login', () => {
    it('should create the correct action types when login is successful', () => {

      const accessToken = 'test-access-token';
      
      store.dispatch({ type: 'auth/login/pending' });
      store.dispatch({ 
        type: 'auth/login/fulfilled',
        payload: accessToken
      });
      
      const actions = store.getActions();
      expect(actions[0].type).toBe('auth/login/pending');
      expect(actions[1].type).toBe('auth/login/fulfilled');
      expect(actions[1].payload).toBe(accessToken);
    });

    it('should create the correct action types when login fails', () => {
      const errorMessage = 'Invalid credentials';
      
      store.dispatch({ type: 'auth/login/pending' });
      store.dispatch({ 
        type: 'auth/login/rejected',
        payload: errorMessage
      });
      
      const actions = store.getActions();
      expect(actions[0].type).toBe('auth/login/pending');
      expect(actions[1].type).toBe('auth/login/rejected');
      expect(actions[1].payload).toBe(errorMessage);
    });
  });

  describe('logout', () => {
    it('should create the correct action types and remove the access token', () => {
      store.dispatch({ type: 'auth/logout/pending' });
      store.dispatch({ type: 'auth/logout/fulfilled' });
      
      const actions = store.getActions();
      expect(actions[0].type).toBe('auth/logout/pending');
      expect(actions[1].type).toBe('auth/logout/fulfilled');
    });
  });
});
