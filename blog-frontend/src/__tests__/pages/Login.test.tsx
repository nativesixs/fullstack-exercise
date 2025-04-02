import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import Login from '../../pages/Login';
import { login } from '../../store/actions/authActions';
import createMockStore from '../../utils/testing/mockStore';

jest.mock('../../store/actions/authActions', () => ({
  login: jest.fn(() => ({ type: 'auth/login/fulfilled' }))
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useLocation: () => ({ state: { from: { pathname: '/admin/articles' } } })
}));

describe('Login Page', () => {
  let store: any;

  beforeEach(() => {
    jest.clearAllMocks();

    store = createMockStore({
      auth: {
        loading: false,
        error: null,
        isAuthenticated: false
      }
    });
  });

  const renderComponent = () => {
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>
    );
  };

  it('renders the login form', () => {
    renderComponent();
    
    expect(screen.getByRole('heading', { name: /log ?in/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log ?in/i })).toBeInTheDocument();
  });

  it('submits the form with username and password', async () => {
    renderComponent();
    
    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /log ?in/i });
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(login).toHaveBeenCalledWith({ username: 'testuser', password: 'password123' });
    });
  });

  it('shows loading state when logging in', () => {
    store = createMockStore({
      auth: {
        loading: true,
        error: null,
        isAuthenticated: false
      }
    });
    
    renderComponent();
    
    const loginButton = screen.getByRole('button', { name: /log ?in/i });
    expect(loginButton).toBeDisabled();
  });

  it('shows error message when login fails', () => {
    store = createMockStore({
      auth: {
        loading: false,
        error: 'Invalid credentials',
        isAuthenticated: false
      }
    });
    
    renderComponent();
    
    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
  });
});
