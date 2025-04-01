import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { Provider, useDispatch } from 'react-redux';
import theme from './theme';
import AppRoutes from './routes';
import { store } from './store/store';
import Layout from './components/Layout';
import { checkAuthentication } from './store/slices/authSlice';
import { AppDispatch } from './store/store';

const AuthChecker: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  
  useEffect(() => {
    dispatch(checkAuthentication());
  }, [dispatch]);
  
  return <>{children}</>;
};

function App() {
  return (
    <Provider store={store}>
      <ChakraProvider theme={theme}>
        <Router>
          <AuthChecker>
            <Layout>
              <AppRoutes />
            </Layout>
          </AuthChecker>
        </Router>
      </ChakraProvider>
    </Provider>
  );
}

export default App;
