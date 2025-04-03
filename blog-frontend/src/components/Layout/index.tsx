import React from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Flex,
  Link,
  Button,
  Heading,
  HStack,
  Divider,
  useColorModeValue,
  Spacer,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  IconButton,
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { logout } from '../../store/actions/authActions';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const isActive = (path: string) => {
    return (
      location.pathname === path ||
      (path === '/admin/articles' && location.pathname.startsWith('/admin/articles/')) ||
      (path === '/' && location.pathname.startsWith('/articles/'))
    );
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
                  fontWeight={isActive('/') ? '600' : '400'}
                  color={isActive('/') ? 'brand.500' : 'gray.700'}
                  borderBottom={isActive('/') ? '2px solid' : 'none'}
                  borderColor="brand.500"
                  pb={1}
                >
                  Recent Articles
                </Link>

                <Link
                  as={RouterLink}
                  to="/about"
                  fontWeight={isActive('/about') ? '600' : '400'}
                  color={isActive('/about') ? 'brand.500' : 'gray.700'}
                  borderBottom={isActive('/about') ? '2px solid' : 'none'}
                  borderColor="brand.500"
                  pb={1}
                >
                  About
                </Link>
              </HStack>
            </HStack>

            <Spacer />

            <HStack spacing={6}>
              {isAuthenticated && (
                <Link
                  as={RouterLink}
                  to="/admin/articles"
                  fontWeight={isActive('/admin/articles') ? '600' : '400'}
                  color={isActive('/admin/articles') ? 'brand.500' : 'gray.700'}
                  borderBottom={isActive('/admin/articles') ? '2px solid' : 'none'}
                  borderColor="brand.500"
                  pb={1}
                  mr={4}
                >
                  My Articles
                </Link>
              )}

              {isAuthenticated && (
                <Button
                  as={RouterLink}
                  to="/admin/new-article"
                  variant="ghost"
                  colorScheme="blue"
                  size="sm"
                  leftIcon={
                    <Box as="span" fontSize="lg">
                      +
                    </Box>
                  }
                  display={{ base: 'none', md: 'flex' }}
                >
                  Create new article
                </Button>
              )}

              {isAuthenticated ? (
                <Menu>
                  <MenuButton
                    as={IconButton}
                    variant="unstyled"
                    aria-label="User options"
                    icon={
                      <HStack>
                        <Avatar size="sm" name="Admin" bg="blue.500" />
                      </HStack>
                    }
                  />
                  <MenuList>
                    <MenuItem
                      as={RouterLink}
                      to="/admin/articles"
                      fontWeight={isActive('/admin/articles') ? '600' : '400'}
                    >
                      My Articles
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </MenuList>
                </Menu>
              ) : (
                <Button as={RouterLink} to="/login" variant="outline" size="sm">
                  Log in
                </Button>
              )}
            </HStack>
          </Flex>
        </Container>
        <Divider />
      </Box>

      <Box flex="1" bg={bgColor} pt={8} pb={16}>
        <Container maxW="container.xl">{children}</Container>
      </Box>
    </Box>
  );
};

export default Layout;
