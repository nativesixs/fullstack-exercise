import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import theme from './theme';
import AppRoutes from './routes';
import store from './store/store';
import Layout from './components/Layout';

function App() {
  return (
    <Provider store={store}>
      <ChakraProvider theme={theme}>
        <Router>
          <Layout>
            <AppRoutes />
          </Layout>
        </Router>
      </ChakraProvider>
    </Provider>
  );
}

export default App;
