import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  Divider,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  HStack,
  Avatar,
  useToast,
  Flex,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { Comment } from '../../types/comment';
import { postComment, upvoteComment, downvoteComment } from '../../api/commentApi';
import websocketService from '../../services/websocketService';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { Link as RouterLink } from 'react-router-dom';

interface CommentsSectionProps {
  articleId: string;
  comments: Comment[];
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ articleId, comments = [] }) => {
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [localComments, setLocalComments] = useState<Comment[]>(comments);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  useEffect(() => {
    const handleCommentEvent = (event: { changeType: string; comment: Comment }) => {
      if (event.comment.articleId === articleId) {
        if (event.changeType === 'commentCreated') {
          setLocalComments(prevComments => {
            // avoid dupes ? maybe not wanted ?
            if (!prevComments.some(c => c.commentId === event.comment.commentId)) {
              return [event.comment, ...prevComments];
            }
            return prevComments;
          });
          
          toast({
            title: 'New comment',
            description: 'Someone just added a new comment',
            status: 'info',
            duration: 3000,
            isClosable: true,
          });
        } else if (event.changeType === 'commentUpVoted' || event.changeType === 'commentDownVoted') {
          setLocalComments(prevComments => 
            prevComments.map(comment => 
              comment.commentId === event.comment.commentId ? event.comment : comment
            )
          );
        }
      }
    };

    websocketService.subscribe(handleCommentEvent);

    return () => {
      websocketService.unsubscribe(handleCommentEvent);
    };
  }, [articleId, toast]);

  useEffect(() => {
    if (comments.length > 0) {
      setLocalComments(comments);
    }
  }, [comments]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy • h:mm a');
    } catch (error) {
      return dateString;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!author.trim() || !content.trim()) {
      toast({
        title: 'Error',
        description: 'Author and comment are required',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    setSubmitting(true);
    
    try {
      const newComment = await postComment({
        articleId,
        author,
        content
      });
      
      setLocalComments(prevComments => [newComment, ...prevComments]);
      setAuthor('');
      setContent('');
      
      toast({
        title: 'Comment posted',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      console.error('Error submitting comment:', error);
      
      let errorMessage = 'Failed to post comment';
      
      if (error.response?.status === 401) {
        errorMessage = 'Authentication required. Please log in to post comments.';
      } else if (error.response?.status === 403) {
        errorMessage = 'You are not authorized to post comments.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error. This might be due to missing authentication.';
      }
      
      setError(errorMessage);
      
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleVote = async (commentId: string, isUpvote: boolean) => {
    try {
      if (isUpvote) {
        await upvoteComment(commentId);
      } else {
        await downvoteComment(commentId);
      }
    } catch (error: any) {
      let errorMessage = 'Failed to vote on comment';
      
      if (error.response?.status === 401) {
        errorMessage = 'Authentication required. Please log in to vote on comments.';
      } else if (error.response?.status === 403) {
        errorMessage = 'You are not authorized to vote on comments.';
      }
      
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box mb={10}>
      <Heading as="h2" size="lg" mb={6}>
        Comments ({localComments.length})
      </Heading>
      
      {!isAuthenticated && (
        <Alert status="warning" mb={6}>
          <AlertIcon />
          <AlertTitle>Authentication required!</AlertTitle>
          <AlertDescription>
            You need to <Button as={RouterLink} to="/login" colorScheme="blue" size="sm" ml={2}>login</Button> 
            to post comments and vote.
          </AlertDescription>
        </Alert>
      )}
      
      {error && (
        <Alert status="error" mb={6}>
          <AlertIcon />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Box as="form" onSubmit={handleSubmit} mb={10} p={6} bg="gray.50" borderRadius="md">
        <Heading as="h3" size="md" mb={4}>
          Add Comment
        </Heading>
        
        <FormControl mb={4} isRequired>
          <FormLabel>Your Name</FormLabel>
          <Input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="John Doe"
            bg="white"
          />
        </FormControl>
        
        <FormControl mb={4} isRequired>
          <FormLabel>Comment</FormLabel>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts..."
            rows={4}
            bg="white"
          />
        </FormControl>
        
        <Button
          type="submit"
          colorScheme="blue"
          isLoading={submitting}
          loadingText="Posting"
          isDisabled={!isAuthenticated}
        >
          Post Comment
        </Button>
      </Box>
      
      {localComments.length > 0 ? (
        <VStack spacing={6} align="stretch">
          {localComments.map((comment) => (
            <Box 
              key={comment.commentId} 
              p={6}
              borderWidth="1px"
              borderRadius="lg"
              borderColor="gray.200"
            >
              <Flex>
                <Box flex="1">
                  <HStack mb={2}>
                    <Avatar size="sm" name={comment.author} />
                    <Text fontWeight="bold">{comment.author}</Text>
                    <Text color="gray.500" fontSize="sm">
                      {formatDate(comment.postedAt)}
                    </Text>
                  </HStack>
                  
                  <Text mb={3}>{comment.content}</Text>
                  
                  <HStack spacing={2}>
                    <Button 
                      size="sm" 
                      onClick={() => handleVote(comment.commentId, true)}
                      colorScheme="blue"
                      variant="outline"
                      isDisabled={!isAuthenticated}
                    >
                      Upvote
                    </Button>
                    <Text fontWeight="bold">{comment.score}</Text>
                    <Button 
                      size="sm" 
                      onClick={() => handleVote(comment.commentId, false)}
                      colorScheme="red"
                      variant="outline"
                      isDisabled={!isAuthenticated}
                    >
                      Downvote
                    </Button>
                  </HStack>
                </Box>
              </Flex>
            </Box>
          ))}
        </VStack>
      ) : (
        <Text color="gray.500" textAlign="center" py={8}>
          No comments yet. Be the first to share your thoughts!
        </Text>
      )}
    </Box>
  );
};

export default CommentsSection;
