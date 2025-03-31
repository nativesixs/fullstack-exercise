import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  useToast
} from '@chakra-ui/react';
import { setApiKey } from '../../utils/tokenStorage';

interface ApiKeySetupProps {
  isOpen: boolean;
  onClose: () => void;
}

const ApiKeySetup: React.FC<ApiKeySetupProps> = ({ isOpen, onClose }) => {
  const [apiKeyValue, setApiKeyValue] = useState('');
  const toast = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKeyValue.trim()) {
      toast({
        title: 'Error',
        description: 'API key cannot be empty',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setApiKey(apiKeyValue);
    toast({
      title: 'Success',
      description: 'API key has been saved',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    
    onClose();
    window.location.reload();
  };

  const createNewTenant = () => {
    window.open('https://fullstack.exercise.applifting.cz/tenants', '_blank');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>API Key Setup</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Text mb={4}>
            You need to set up an API key before you can use this application.
          </Text>
          <Text mb={4}>
            If you don't have an API key, you can create one by clicking the "Create New Tenant" button below.
          </Text>
          <form onSubmit={handleSubmit}>
            <FormControl mb={4}>
              <FormLabel>API Key</FormLabel>
              <Input
                value={apiKeyValue}
                onChange={(e) => setApiKeyValue(e.target.value)}
                placeholder="Enter your API key"
              />
            </FormControl>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            Save API Key
          </Button>
          <Button onClick={createNewTenant} variant="outline" mr={3}>
            Create New Tenant
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ApiKeySetup;