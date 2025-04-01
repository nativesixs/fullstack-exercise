import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Spinner,
  Flex,
  useToast,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchArticleById, updateArticle } from '../../store/actions/articleActions';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';

const AdminArticleDetail: React.FC = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const toast = useToast();
  
  const { currentArticle, loading, error } = useSelector((state: RootState) => state.articles);

  const [title, setTitle] = useState('');
  const [perex, setPerex] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    title: '',
    perex: '',
    content: '',
  });

  useEffect(() => {
    if (articleId) {
      dispatch(fetchArticleById(articleId));
    }
  }, [dispatch, articleId]);

  useEffect(() => {
    if (currentArticle) {
      setTitle(currentArticle.title);
      setPerex(currentArticle.perex);
      setContent(currentArticle.content);
    }
  }, [currentArticle]);

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
      if (articleId) {
        await dispatch(updateArticle({
          articleId,
          articleData: {
            title,
            perex,
            content,
          },
        })).unwrap();
        
        toast({
          title: 'Article updated',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        
        navigate('/admin/articles');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update article',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Flex justify="center" mt={10}>
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Box>
        <Heading as="h1" mb={4}>Edit Article</Heading>
        <Box color="red.500">{error}</Box>
      </Box>
    );
  }

  return (
    <Box>
      <Heading as="h1" mb={6}>Edit Article</Heading>
      
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
          
          <FormControl isInvalid={!!validationErrors.content} isRequired>
            <FormLabel>Content</FormLabel>
            <Box border={validationErrors.content ? '1px solid red' : '1px solid #E2E8F0'} borderRadius="md">
              <SimpleMDE 
                value={content}
                onChange={setContent}
                options={{
                  spellChecker: false,
                  placeholder: 'Write your article content here...',
                  status: false,
                }}
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
              loadingText="Updating"
            >
              Update Article
            </Button>
          </HStack>
        </VStack>
      </Box>
    </Box>
  );
};

export default AdminArticleDetail;
