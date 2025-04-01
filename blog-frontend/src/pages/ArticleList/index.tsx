import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Heading,
  Text,
  Stack,
  Link,
  Divider,
  Flex,
  Spinner,
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchArticles } from '../../store/actions/articleActions';
import { format } from 'date-fns';
import ApiKeySetup from '../../components/ApiKeySetup';

const ArticleList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { articles, loading, error } = useSelector((state: RootState) => state.articles);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchArticles());
  }, [dispatch]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <Flex justify="center" mt={10}>
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error && error.includes('API key')) {
    return (
      <Box>
        <Heading as="h1" mb={4}>Recent Articles</Heading>
        <Text color="red.500" mb={4}>Error: {error}</Text>
        <Button 
          colorScheme="blue" 
          onClick={() => setIsApiKeyModalOpen(true)}
        >
          Set API Key
        </Button>
        <ApiKeySetup 
          isOpen={isApiKeyModalOpen} 
          onClose={() => setIsApiKeyModalOpen(false)} 
        />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Heading as="h1" mb={4}>Recent Articles</Heading>
        <Text color="red.500" mb={4}>Error: {error}</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Heading as="h1" mb={6}>Recent Articles</Heading>
      
      {!articles || articles.length === 0 ? (
        <Text>No articles found.</Text>
      ) : (
        <Stack spacing={8}>
          {articles.map((article) => (
            <Box key={article.articleId}>
              <Heading as="h2" size="lg" mb={2}>
                <Link as={RouterLink} to={`/articles/${article.articleId}`} color="blue.600">
                  {article.title}
                </Link>
              </Heading>
              
              <Text color="gray.500" fontSize="sm" mb={3}>
                {formatDate(article.createdAt)}
              </Text>
              
              <Text mb={4}>{article.perex}</Text>
              
              <Flex>
                <Link as={RouterLink} to={`/articles/${article.articleId}`} color="blue.600">
                  Read whole article
                </Link>
              </Flex>
              
              <Divider mt={6} />
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default ArticleList;
