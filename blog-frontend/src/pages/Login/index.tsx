import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  VStack,
  FormErrorMessage,
  useToast,
  Flex,
  Alert,
  AlertIcon,
  Container,
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { login } from '../../store/actions/authActions';
import { useNavigate, useLocation } from 'react-router-dom';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({
    username: '',
    password: '',
  });
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  
  const { isAuthenticated, loading, error } = useSelector((state: RootState) => state.auth);
  
  const from = location.state?.from?.pathname || '/admin/articles';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const validateForm = () => {
    const newErrors = {
      username: '',
      password: '',
    };
    let isValid = true;

    if (!username.trim()) {
      newErrors.username = 'Username is required';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await dispatch(login({ username, password })).unwrap();
      toast({
        title: 'Login successful',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
    }
  };

  return (
    <Container maxW="container.sm" py={20}>
      <Flex minH="50vh" align="center" justify="center">
        <Box 
          bg="white" 
          p={10}
          borderRadius="xl"
          boxShadow="0 10px 25px rgba(0, 0, 0, 0.08)"
          w="100%" 
          maxW="480px"
          border="1px solid"
          borderColor="gray.100"
        >
          <Heading as="h1" size="lg" mb={8} textAlign="center" color="gray.800">
            Log In
          </Heading>
          
          {error && (
            <Alert status="error" mb={8} borderRadius="md">
              <AlertIcon />
              {error}
            </Alert>
          )}
          
          <Box as="form" onSubmit={handleSubmit}>
            <VStack spacing={6}>
              <FormControl isInvalid={!!errors.username} isRequired>
                <FormLabel fontWeight="medium">Username</FormLabel>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="john doe"
                  bg="white"
                  borderColor="gray.300"
                  size="lg"
                  height="50px"
                />
                <FormErrorMessage>{errors.username}</FormErrorMessage>
              </FormControl>
              
              <FormControl isInvalid={!!errors.password} isRequired>
                <FormLabel fontWeight="medium">Password</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  bg="white"
                  borderColor="gray.300"
                  size="lg"
                  height="50px"
                />
                <FormErrorMessage>{errors.password}</FormErrorMessage>
              </FormControl>
              
              <Button
                type="submit"
                colorScheme="blue"
                w="100%"
                mt={4}
                isLoading={loading}
                size="lg"
                height="50px"
                fontWeight="600"
              >
                Log In
              </Button>
            </VStack>
          </Box>
        </Box>
      </Flex>
    </Container>
  );
};

export default Login;
