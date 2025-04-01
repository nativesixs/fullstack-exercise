import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import {
  Box,
  Heading,
  Text,
  Divider,
  Spinner,
  Flex,
  Image,
  Container,
} from '@chakra-ui/react';
import { AppDispatch, RootState } from '../../store/store';
import { fetchArticleById } from '../../store/actions/articleActions';
import { format } from 'date-fns';
import CommentsSection from '../../components/CommentsSection';
import { getCommentsForArticle } from '../../api/commentApi';
import { Comment } from '../../types/comment';
import { config } from '../../config';

const ArticleDetail: React.FC = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { currentArticle, loading, error } = useSelector((state: RootState) => state.articles);
  
  const [mockComments, setMockComments] = useState<Comment[]>([]);

  useEffect(() => {
    if (articleId) {
      dispatch(fetchArticleById(articleId));
      
      if (config.USE_MOCKS) {
        const comments = getCommentsForArticle(articleId);
        setMockComments(comments);
      }
    }
  }, [dispatch, articleId]);

  let comments: Comment[];
  
  if (config.USE_MOCKS) {
    const allComments = [...(currentArticle?.comments || []), ...mockComments];
    comments = allComments.filter((comment, index, self) => 
      index === self.findIndex(c => c.commentId === comment.commentId)
    );
  } else {
    comments = currentArticle?.comments || [];
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
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

  if (error) {
    return (
      <Box>
        <Text color="red.500">Error: {error}</Text>
      </Box>
    );
  }

  if (!currentArticle) {
    return (
      <Box>
        <Text>Article not found</Text>
      </Box>
    );
  }

  return (
    <Container maxW="container.md">
      <Box mb={8}>
        <Heading as="h1" size="2xl" mb={4}>
          {currentArticle.title}
        </Heading>
        
        <Text color="gray.600" mb={6}>
          {formatDate(currentArticle.createdAt)}
        </Text>
        
        {currentArticle.imageId && (
          <Box mb={6}>
            <Image
              src={`https://fullstack.exercise.applifting.cz/images/${currentArticle.imageId}`}
              alt={currentArticle.title}
              borderRadius="md"
              width="100%"
            />
          </Box>
        )}
        
        <Text fontSize="lg" fontWeight="medium" mb={6}>
          {currentArticle.perex}
        </Text>
        
        <Divider mb={6} />
        
        <Box className="markdown-content">
          <ReactMarkdown>{currentArticle.content}</ReactMarkdown>
        </Box>
      </Box>
      
      <Divider my={8} />
      
      <CommentsSection articleId={currentArticle.articleId} comments={comments} />
    </Container>
  );
};

export default ArticleDetail;
