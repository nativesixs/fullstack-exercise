import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Heading,
  useToast,
} from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { createArticle } from '../../store/actions/articleActions';
import ArticleForm from '../../components/ArticleForm';
import { ArticleFormData } from '../../utils/formValidation';

const NewArticle: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (formData: ArticleFormData & { imageId?: string }) => {
    setSubmitting(true);
    
    try {
      await dispatch(createArticle(formData)).unwrap();
      
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

  return (
    <Box>
      <Heading as="h1" mb={6}>Create New Article</Heading>
      
      <ArticleForm
        onSubmit={handleSubmit}
        isSubmitting={submitting}
        submitButtonText="Publish Article"
      />
    </Box>
  );
};

export default NewArticle;
