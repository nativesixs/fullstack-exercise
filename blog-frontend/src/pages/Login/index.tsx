import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  VStack,
  Text,
  FormErrorMessage,
  useToast,
  Flex,
  Alert,
  AlertIcon,
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
    <Flex minH="70vh" align="center" justify="center">
      <Box 
        bg="white" 
        p={8} 
        borderRadius="lg" 
        boxShadow="sm"
        w="100%" 
        maxW="400px"
      >
        <Heading as="h1" size="lg" mb={6} textAlign="center">
          Log In
        </Heading>
        
        {error && (
          <Alert status="error" mb={6} borderRadius="md">
            <AlertIcon />
            {error}
          </Alert>
        )}
        
        <Box as="form" onSubmit={handleSubmit}>
          <VStack spacing={5}>
            <FormControl isInvalid={!!errors.username} isRequired>
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="johndoe"
              />
              <FormErrorMessage>{errors.username}</FormErrorMessage>
            </FormControl>
            
            <FormControl isInvalid={!!errors.password} isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
              />
              <FormErrorMessage>{errors.password}</FormErrorMessage>
            </FormControl>
            
            <Button
              type="submit"
              colorScheme="blue"
              w="100%"
              mt={4}
              isLoading={loading}
            >
              Log In
            </Button>
            
            <Text fontSize="sm" color="gray.500" mt={4} textAlign="center">
              Don't have an account? Please contact your administrator.
            </Text>
          </VStack>
        </Box>
      </Box>
    </Flex>
  );
};

export default Login;
