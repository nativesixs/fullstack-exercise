import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock dependencies to avoid errors
jest.mock('react-redux', () => ({
  Provider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useSelector: () => false,
  useDispatch: () => jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Routes: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Route: () => <div>Route</div>,
  Link: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useNavigate: () => jest.fn(),
}));

test('renders without crashing', () => {
  render(<App />);
  expect(document.body).toBeInTheDocument();
});
