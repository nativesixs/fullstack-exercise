import React from 'react';
import { Box, Container, Flex, Heading, Spacer, Button, Link } from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { logout } from '../../store/slices/authSlice';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <Box minH="100vh" bg="gray.50">
      <Box as="header" bg="white" boxShadow="sm" py={4}>
        <Container maxW="container.xl">
          <Flex align="center">
            <Heading size="md" as={RouterLink} to="/">
              Blog Engine
            </Heading>
            <Spacer />
            <Box>
              {isAuthenticated ? (
                <Flex gap={4}>
                  <Button as={RouterLink} to="/admin/articles" colorScheme="gray" variant="ghost">
                    My Articles
                  </Button>
                  <Button as={RouterLink} to="/admin/new-article" colorScheme="blue">
                    Create Article
                  </Button>
                  <Button onClick={handleLogout} variant="outline">
                    Logout
                  </Button>
                </Flex>
              ) : (
                <Button as={RouterLink} to="/login" colorScheme="blue">
                  Login
                </Button>
              )}
            </Box>
          </Flex>
        </Container>
      </Box>
      <Container maxW="container.xl" py={8}>
        {children}
      </Container>
    </Box>
  );
};

export default Layout;
