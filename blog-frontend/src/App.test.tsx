import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ChakraProvider } from '@chakra-ui/react';
import App from './App';
import { store } from './store/store';

jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <div data-testid="mock-router">{children}</div>,
  Routes: ({ children }: { children: React.ReactNode }) => <div data-testid="mock-routes">{children}</div>,
  Route: ({ children }: { children: React.ReactNode }) => <div data-testid="mock-route">{children}</div>,
  Navigate: () => <div data-testid="mock-navigate" />,
  useNavigate: () => jest.fn(),
  useLocation: () => ({ pathname: '/' }),
  useParams: () => ({}),
  Link: ({ children, to }: { children: React.ReactNode, to: string }) => (
    <a href={to} data-testid="mock-link">{children}</a>
  )
}));

jest.mock('./components/Layout', () => {
  return {
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="mock-layout">{children}</div>
    )
  };
});

jest.mock('./api/articleApi', () => ({
  getArticles: jest.fn().mockResolvedValue([])
}));

describe('App', () => {
  it('renders without crashing', () => {
    render(
      <Provider store={store}>
        <ChakraProvider>
          <App />
        </ChakraProvider>
      </Provider>
    );
    
    expect(screen.getByTestId('mock-router')).toBeInTheDocument();
  });
});
