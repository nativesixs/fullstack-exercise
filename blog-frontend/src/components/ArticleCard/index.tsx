import React from 'react';
import { Box, Heading, Text, Flex, Link, HStack, Badge } from '@chakra-ui/react';
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
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      mb={6}
      bg="white"
      boxShadow="sm"
      transition="box-shadow 0.2s"
      _hover={{ boxShadow: 'md' }}
    >
      <Flex direction={{ base: 'column', md: 'row' }}>
        {article.imageId && (
          <Box
            width={{ base: '100%', md: '30%' }}
            height={{ base: '200px', md: '250px' }}
            position="relative"
          >
            <ApiImage
              imageId={article.imageId}
              alt={article.title}
              height="100%"
              width="100%"
              minHeight="0"
              fallbackText="Image unavailable"
              objectFit="cover"
            />
          </Box>
        )}

        <Box p={6} width={{ base: '100%', md: article.imageId ? '70%' : '100%' }}>
          <Heading as="h2" size="lg" mb={2} lineHeight="1.2">
            <Link as={RouterLink} to={`/articles/${article.articleId}`} color="blue.600">
              {article.title}
            </Link>
          </Heading>

          <HStack spacing={2} mb={3} color="gray.600">
            <Text fontWeight="medium">Admin</Text>
            <Text>•</Text>
            <Text fontSize="sm">{formatDate(article.createdAt)}</Text>
          </HStack>

          <Text mb={4} noOfLines={3} color="gray.700">
            {article.perex}
          </Text>

          <HStack spacing={4} align="center">
            <Link
              as={RouterLink}
              to={`/articles/${article.articleId}`}
              color="blue.600"
              fontWeight="500"
              _hover={{ textDecoration: 'none', color: 'blue.700' }}
            >
              Read whole article
            </Link>

            <Badge colorScheme="blue" borderRadius="full" px={2}>
              0 comments
            </Badge>
          </HStack>
        </Box>
      </Flex>
    </Box>
  );
};

export default ArticleCard;
