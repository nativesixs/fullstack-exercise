import React from 'react';
import { Box, Heading, Text, Flex, Link } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { format } from 'date-fns';
import { Article } from '../../types/article';
import ApiImage from '../ApiImage';

interface ArticleCardProps {
  article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden" mb={6}>
      <Flex direction={{ base: 'column', md: 'row' }}>
        {article.imageId && (
          <Box width={{ base: '100%', md: '30%' }} minHeight="200px" position="relative">
            <ApiImage
              imageId={article.imageId}
              alt={article.title}
              height="100%"
              width="100%"
              minHeight="200px"
              fallbackText="Image unavailable"
            />
          </Box>
        )}
        
        <Box p={6} width={{ base: '100%', md: article.imageId ? '70%' : '100%' }}>
          <Heading as="h2" size="lg" mb={2}>
            <Link as={RouterLink} to={`/articles/${article.articleId}`} color="blue.600">
              {article.title}
            </Link>
          </Heading>
          
          <Text color="gray.500" fontSize="sm" mb={3}>
            {formatDate(article.createdAt)}
          </Text>
          
          <Text mb={4} noOfLines={3}>
            {article.perex}
          </Text>
          
          <Flex>
            <Link as={RouterLink} to={`/articles/${article.articleId}`} color="blue.600">
              Read whole article
            </Link>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

export default ArticleCard;
