import React from 'react';
import { 
  Box, 
  Flex, 
  Container, 
  Button, 
  Heading, 
  Link, 
  IconButton, 
  useColorMode, 
  Divider,
  HStack,
  useBreakpointValue
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { logout } from '../../store/actions/authActions';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const isActive = (path: string) => {
    return location.pathname === path || 
    (path === '/admin/articles' && location.pathname.startsWith('/admin/articles/')) ||
    (path === '/' && location.pathname.startsWith('/articles/'));
  };

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Box as="header" bg="white" boxShadow="sm" position="sticky" top={0} zIndex={10}>
        <Container maxW="container.xl">
          <Flex as="nav" py={4} alignItems="center" justify="space-between">
            <HStack spacing={8}>
              <Heading as="h1" size="md" fontWeight="700" letterSpacing="-0.5px">
                <Link as={RouterLink} to="/" _hover={{ textDecoration: 'none' }}>
                  Applifting
                </Link>
              </Heading>
              
              <HStack spacing={6}>
                <Link 
                  as={RouterLink} 
                  to="/" 
                  fontWeight={isActive('/') ? "600" : "400"}
                  color={isActive('/') ? "brand.500" : "gray.700"}
                  borderBottom={isActive('/') ? "2px solid" : "none"}
                  borderColor="brand.500"
                  pb={1}
                >
                  Recent Articles
                </Link>
                
                {isAuthenticated && (
                  <Link 
                    as={RouterLink} 
                    to="/admin/articles" 
                    fontWeight={isActive('/admin/articles') ? "600" : "400"}
                    color={isActive('/admin/articles') ? "brand.500" : "gray.700"}
                    borderBottom={isActive('/admin/articles') ? "2px solid" : "none"}
                    borderColor="brand.500"
                    pb={1}
                  >
                    My Articles
                  </Link>
                )}
              </HStack>
            </HStack>
            
            <HStack spacing={4}>
              <IconButton
                aria-label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`}
                icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                onClick={toggleColorMode}
                variant="ghost"
                size="sm"
              />
              
              {isAuthenticated ? (
                <Button 
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                >
                  Logout
                </Button>
              ) : (
                <Button 
                  as={RouterLink} 
                  to="/login"
                  variant="outline"
                  size="sm"
                >
                  Log in
                </Button>
              )}
              
              {isAuthenticated && (
                <Button 
                  as={RouterLink}
                  to="/admin/new-article"
                  colorScheme="blue"
                  size="sm"
                  leftIcon={<Box as="span" fontSize="lg">+</Box>}
                  display={{ base: 'none', md: 'flex' }}
                >
                  Create new article
                </Button>
              )}
            </HStack>
          </Flex>
        </Container>
        <Divider />
      </Box>
      
      <Box as="main" flex="1" py={8} bg="gray.50">
        <Container maxW="container.xl">
          {children}
        </Container>
      </Box>
      
      <Box as="footer" bg="white" py={6} borderTop="1px solid" borderColor="gray.200">
        <Container maxW="container.xl">
          <Flex 
            direction={{ base: 'column', md: 'row' }} 
            justify="space-between" 
            alignItems={{ base: 'center', md: 'center' }}
            gap={{ base: 4, md: 0 }}
          >
            <Box color="gray.600" fontSize="sm">© {new Date().getFullYear()} Applifting</Box>
            <HStack spacing={6} color="gray.600">
              <Link href="#" fontSize="sm">Privacy Policy</Link>
              <Link href="#" fontSize="sm">Terms of Service</Link>
            </HStack>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
