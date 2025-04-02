import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Heading,
  VStack,
  HStack,
  useToast,
  FormErrorMessage,
  Divider,
} from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { createArticle } from '../../store/actions/articleActions';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import ImageUploader from '../../components/ImageUploader';

const NewArticle: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const toast = useToast();
  
  const [title, setTitle] = useState('');
  const [perex, setPerex] = useState('');
  const [content, setContent] = useState('');
  const [imageId, setImageId] = useState<string | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    title: '',
    perex: '',
    content: '',
  });

  const validateForm = () => {
    const errors = {
      title: '',
      perex: '',
      content: '',
    };
    
    let isValid = true;
    
    if (!title.trim()) {
      errors.title = 'Title is required';
      isValid = false;
    }
    
    if (!perex.trim()) {
      errors.perex = 'Perex is required';
      isValid = false;
    }
    
    if (!content.trim()) {
      errors.content = 'Content is required';
      isValid = false;
    }
    
    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    
    try {
      await dispatch(createArticle({
        title,
        perex,
        content,
        imageId,
      })).unwrap();
      
      toast({
        title: 'Article created',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      navigate('/admin/articles');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create article',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageUploaded = (newImageId: string) => {
    setImageId(newImageId);
  };

  const handleImageRemoved = () => {
    setImageId(undefined);
  };

  const handleContentChange = useCallback((value: string) => {
    setContent(value);
  }, []);

  const editorOptions = React.useMemo(() => {
    return {
      spellChecker: false,
      placeholder: 'Write your article content here...',
      status: false,
    };
  }, []);

  return (
    <Box>
      <Heading as="h1" mb={6}>Create New Article</Heading>
      
      <Box as="form" onSubmit={handleSubmit}>
        <VStack spacing={6} align="stretch">
          <FormControl isInvalid={!!validationErrors.title} isRequired>
            <FormLabel>Article Title</FormLabel>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My First Article"
            />
            <FormErrorMessage>{validationErrors.title}</FormErrorMessage>
          </FormControl>
          
          <ImageUploader 
            onImageUploaded={handleImageUploaded}
            onImageRemoved={handleImageRemoved}
          />
          
          <FormControl isInvalid={!!validationErrors.perex} isRequired>
            <FormLabel>Perex</FormLabel>
            <Textarea
              value={perex}
              onChange={(e) => setPerex(e.target.value)}
              placeholder="Brief summary of the article"
              rows={3}
            />
            <FormErrorMessage>{validationErrors.perex}</FormErrorMessage>
          </FormControl>
          
          <Divider />
          
          <FormControl isInvalid={!!validationErrors.content} isRequired>
            <FormLabel>Content</FormLabel>
            <Box border={validationErrors.content ? '1px solid red' : '1px solid #E2E8F0'} borderRadius="md">
              <SimpleMDE 
                value={content}
                onChange={handleContentChange}
                options={editorOptions}
              />
            </Box>
            {validationErrors.content && (
              <FormErrorMessage>{validationErrors.content}</FormErrorMessage>
            )}
          </FormControl>
          
          <HStack spacing={4} justify="flex-end">
            <Button
              variant="outline"
              onClick={() => navigate('/admin/articles')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              colorScheme="blue"
              isLoading={submitting}
              loadingText="Creating"
            >
              Publish Article
            </Button>
          </HStack>
        </VStack>
      </Box>
    </Box>
  );
};

export default NewArticle;
