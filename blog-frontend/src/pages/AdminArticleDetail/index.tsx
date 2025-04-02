import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Heading,
  Flex,
  Spinner,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchArticleById, updateArticle } from '../../store/actions/articleActions';
import ArticleForm from '../../components/ArticleForm';
import { ArticleFormData } from '../../utils/formValidation';

const AdminArticleDetail: React.FC = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const { currentArticle, loading, error } = useSelector((state: RootState) => state.articles);
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (articleId) {
      dispatch(fetchArticleById(articleId));
    }
  }, [dispatch, articleId]);

  const handleSubmit = async (formData: ArticleFormData & { imageId?: string }) => {
    if (!articleId) return;
    
    setSubmitting(true);
    
    try {
      await dispatch(updateArticle({
        articleId,
        articleData: formData,
      })).unwrap();
      
      toast({
        title: 'Article updated',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      navigate('/admin/articles');
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
        <Text color="red.500">{error}</Text>
      </Box>
    );
  }

  if (!currentArticle) {
    return (
      <Box>
        <Heading as="h1" mb={4}>Edit Article</Heading>
        <Text>Article not found</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Heading as="h1" mb={6}>Edit Article</Heading>
      
      <ArticleForm
        initialData={{
          title: currentArticle.title,
          perex: currentArticle.perex,
          content: currentArticle.content,
          imageId: currentArticle.imageId,
        }}
        onSubmit={handleSubmit}
        isSubmitting={submitting}
        submitButtonText="Update Article"
      />
    </Box>
  );
};

export default AdminArticleDetail;
