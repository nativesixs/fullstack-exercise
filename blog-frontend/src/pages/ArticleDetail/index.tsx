import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import {
  Box,
  Heading,
  Text,
  Divider,
  Container,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { AppDispatch, RootState } from '../../store/store';
import { fetchArticleById } from '../../store/actions/articleActions';
import { format } from 'date-fns';
import CommentsSection from '../../components/CommentsSection';
import { getCommentsForArticle } from '../../api/commentApi';
import { Comment } from '../../types/comment';
import { config } from '../../config';
import LoadingState from '../../components/LoadingState';
import ApiImage from '../../components/ApiImage';

const ArticleDetail: React.FC = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { currentArticle, loading, error } = useSelector((state: RootState) => state.articles);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    if (articleId) {
      dispatch(fetchArticleById(articleId));
      
      // Load comments via API
      const fetchComments = async () => {
        try {
          const fetchedComments = await getCommentsForArticle(articleId);
          setComments(fetchedComments);
        } catch (error) {
          console.error("Error fetching comments:", error);
          setComments([]);
        }
      };
      
      fetchComments();
    }
  }, [dispatch, articleId]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  if (loading) {
    return <LoadingState text="Loading article..." fullPage />;
  }

  if (error) {
    return (
      <Alert status="error" variant="solid">
        <AlertIcon />
        Error loading article: {error}
      </Alert>
    );
  }

  if (!currentArticle) {
    return (
      <Alert status="warning">
        <AlertIcon />
        Article not found
      </Alert>
    );
  }

  return (
    <Container maxW="container.md" bg="white" p={{ base: 6, md: 10 }} borderRadius="lg" boxShadow="sm">
      <Box mb={8}>
        <Heading as="h1" size="2xl" mb={3} lineHeight="1.2">
          {currentArticle.title}
        </Heading>
        
        <Text color="gray.600" fontSize="md" mb={8}>
          {formatDate(currentArticle.createdAt)}
        </Text>
        
        {currentArticle.imageId && (
          <Box mb={8} height={{ base: "250px", md: "400px" }} overflow="hidden" borderRadius="md">
            <ApiImage
              imageId={currentArticle.imageId}
              alt={currentArticle.title}
              borderRadius="md"
              width="100%"
              height="100%"
              minHeight="0"
              objectFit="cover"
              fallbackText="Article image"
            />
          </Box>
        )}
        
        <Box mb={6}>
          <Text fontSize="xl" fontWeight="medium" lineHeight="1.6">
            {currentArticle.perex}
          </Text>
        </Box>
        
        <Divider mb={8} borderColor="gray.300" />
        
        <Box className="markdown-content">
          <ReactMarkdown>
            {currentArticle.content}
          </ReactMarkdown>
        </Box>
      </Box>
      
      <Box mt={12}>
        <CommentsSection 
          articleId={currentArticle.articleId}
          comments={comments}
        />
      </Box>
    </Container>
  );
};

export default ArticleDetail;
