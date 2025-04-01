import React from 'react';
import { Box, Flex, Container, Button, Heading, Spacer, Link, IconButton, useColorMode, useColorModeValue } from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { logout } from '../../store/actions/authActions';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <Box minH="100vh" bg={bgColor}>
      <Box as="header" bg="white" boxShadow="sm" position="sticky" top={0} zIndex={10}>
        <Container maxW="container.xl">
          <Flex as="nav" py={4} alignItems="center">
            <Heading as="h1" size="md">
              <Link as={RouterLink} to="/" _hover={{ textDecoration: 'none' }}>
                Blog App
              </Link>
            </Heading>
            
            <Spacer />
            
            <Flex gap={4} alignItems="center">
              <Link as={RouterLink} to="/">
                Recent Articles
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link as={RouterLink} to="/admin/articles">
                    My Articles
                  </Link>
                  <Link as={RouterLink} to="/admin/new-article">
                    Add Article
                  </Link>
                  <Button variant="outline" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <Link as={RouterLink} to="/login">
                  Login
                </Link>
              )}
              
              <IconButton
                aria-label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`}
                icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                onClick={toggleColorMode}
                variant="ghost"
              />
            </Flex>
          </Flex>
        </Container>
      </Box>
      
      <Container maxW="container.xl" py={8}>
        {children}
      </Container>
      
      <Box as="footer" bg="white" py={6} mt="auto">
        <Container maxW="container.xl">
          <Flex justifyContent="space-between" alignItems="center">
            <Box>© {new Date().getFullYear()} Blog App</Box>
            <Flex gap={6}>
              <Link href="#">Privacy</Link>
              <Link href="#">Terms</Link>
              <Link href="#">Contact</Link>
            </Flex>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
