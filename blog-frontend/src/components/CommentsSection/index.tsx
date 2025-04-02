import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  FormControl,
  FormLabel,
  Textarea,
  VStack,
  HStack,
  Avatar,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  IconButton
} from '@chakra-ui/react';
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { formatDate } from '../../utils/dateUtils';
import { Comment, UserVotes, VoteType, VoteValue } from '../../types/comment';
import { postComment, upvoteComment, downvoteComment } from '../../api/commentApi';
import { validateCommentForm } from '../../utils/formValidation';
import websocketService from '../../services/websocketService';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { Link as RouterLink } from 'react-router-dom';

// Component props interface
interface CommentsSectionProps {
  articleId: string;
  comments: Comment[];
}

// User votes storage key
const USER_VOTES_KEY = 'user_comment_votes';

/**
 * Get stored user votes from localStorage
 */
const getStoredUserVotes = (): UserVotes => {
  try {
    const storedVotes = localStorage.getItem(USER_VOTES_KEY);
    return storedVotes ? JSON.parse(storedVotes) : {};
  } catch (error) {
    console.error('Error retrieving stored votes:', error);
    return {};
  }
};

/**
 * Save user votes to localStorage
 */
const saveUserVotes = (votes: UserVotes): void => {
  try {
    localStorage.setItem(USER_VOTES_KEY, JSON.stringify(votes));
  } catch (error) {
    console.error('Error saving votes:', error);
  }
};

/**
 * Comments section component
 */
const CommentsSection: React.FC<CommentsSectionProps> = ({ articleId, comments = [] }) => {
  const [content, setContent] = useState('');
  const [localComments, setLocalComments] = useState<Comment[]>(comments);
  const [userVotes, setUserVotes] = useState<UserVotes>(getStoredUserVotes());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const toast = useToast();
  
  // Track processed comment IDs to avoid duplicates from WebSocket
  const processedCommentIds = useRef<Set<string>>(new Set());
  
  // Default username for comments
  const username = 'Anonymous';
  
  // Update local comments when props change
  useEffect(() => {
    // Add any new comments from props that aren't in localComments
    const newComments = comments.filter(comment => 
      !localComments.some(localComment => localComment.commentId === comment.commentId)
    );
    
    if (newComments.length > 0) {
      setLocalComments(prevComments => [...prevComments, ...newComments]);
    }
  }, [comments, localComments]);
  
  // Set up WebSocket for real-time comments
  useEffect(() => {
    if (!articleId) return;
    
    // Mark existing comments as processed
    comments.forEach(comment => {
      processedCommentIds.current.add(comment.commentId);
    });
    
    const handleNewComment = (comment: Comment) => {
      // Check if this comment is for our article and hasn't been processed yet
      if (comment.articleId === articleId && !processedCommentIds.current.has(comment.commentId)) {
        processedCommentIds.current.add(comment.commentId);
        setLocalComments(prevComments => [comment, ...prevComments]);
        
        toast({
          title: 'New Comment',
          description: `${comment.author} posted a new comment`,
          status: 'info',
          duration: 3000,
          isClosable: true,
          position: 'bottom-right',
        });
      }
    };
    
    // Connect to WebSocket
    websocketService.connect();
    websocketService.subscribeToComments(handleNewComment);
    
    return () => {
      websocketService.unsubscribeFromComments();
    };
  }, [articleId, toast, comments]);
  
  // Submit a new comment
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const { isValid, errors } = validateCommentForm({ content, author: username });
    
    if (!isValid) {
      if (errors.content) {
        toast({
          title: 'Error',
          description: errors.content,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
      return;
    }
    
    setSubmitting(true);
    
    try {
      const newComment = await postComment({
        articleId,
        author: username,
        content
      });
      
      processedCommentIds.current.add(newComment.commentId);
      
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

  // Handle comment voting (upvote/downvote)
  const handleVote = async (commentId: string, voteType: VoteType) => {
    if (!isAuthenticated) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to vote on comments',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const currentVote = userVotes[commentId] || 0;
      let newVoteState: VoteValue;
      let apiActions: Array<() => Promise<Comment>> = [];
      
      // Determine the new vote state based on current state and vote type
      if (voteType === 'up') {
        if (currentVote === 1) {
          // Cancel upvote
          newVoteState = 0;
          apiActions.push(() => downvoteComment(commentId));
        } else if (currentVote === -1) {
          // Change from downvote to upvote (+2)
          newVoteState = 1;
          apiActions.push(() => upvoteComment(commentId));
          apiActions.push(() => upvoteComment(commentId));
        } else {
          // New upvote
          newVoteState = 1;
          apiActions.push(() => upvoteComment(commentId));
        }
      } else { 
        if (currentVote === -1) {
          // Cancel downvote
          newVoteState = 0;
          apiActions.push(() => upvoteComment(commentId));
        } else if (currentVote === 1) {
          // Change from upvote to downvote (-2)
          newVoteState = -1;
          apiActions.push(() => downvoteComment(commentId));
          apiActions.push(() => downvoteComment(commentId));
        } else {
          // New downvote
          newVoteState = -1;
          apiActions.push(() => downvoteComment(commentId));
        }
      }
      
      // Execute all API actions for this vote
      for (const action of apiActions) {
        await action();
      }

      // Update local vote state
      const updatedVotes = { ...userVotes, [commentId]: newVoteState };
      setUserVotes(updatedVotes);
      saveUserVotes(updatedVotes);

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

  // Sort comments by date (newest first)
  const sortedComments = [...localComments].sort(
    (a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
  );

  return (
    <Box mb={10} data-testid="comments-section">
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
      
      {isAuthenticated && (
        <Box as="form" role="form" onSubmit={handleSubmit} mb={10} p={6} bg="gray.50" borderRadius="md">
          <Heading as="h3" size="md" mb={4}>
            Add Comment
          </Heading>
          
          <FormControl mb={4} isRequired>
            <FormLabel>Comment</FormLabel>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts..."
              minH="120px"
            />
          </FormControl>
          
          <Button
            type="submit"
            colorScheme="blue"
            isLoading={submitting}
            loadingText="Posting..."
          >
            Post Comment
          </Button>
        </Box>
      )}
      
      {sortedComments.length === 0 ? (
        <Box textAlign="center" py={8} bg="gray.50" borderRadius="md">
          <Text color="gray.500">No comments yet. Be the first to comment!</Text>
        </Box>
      ) : (
        <VStack spacing={6} align="stretch">
          {sortedComments.map((comment) => (
            <Box 
              key={comment.commentId} 
              p={6} 
              bg="white" 
              borderRadius="md" 
              boxShadow="sm"
              borderLeft="4px solid"
              borderColor="blue.400"
            >
              <HStack mb={2} justify="space-between">
                <HStack>
                  <Avatar size="sm" name={comment.author} bg="blue.500" />
                  <Text fontWeight="bold">{comment.author}</Text>
                </HStack>
                <Text color="gray.500" fontSize="sm">
                  {formatDate(comment.postedAt, 'PPp')}
                </Text>
              </HStack>
              
              <Text mb={4}>{comment.content}</Text>
              
              <HStack spacing={2} align="center">
                <Text fontWeight="bold" fontSize="md" color="gray.700">
                  {comment.score}
                </Text>
                <IconButton
                  icon={<ChevronUpIcon boxSize={5} />}
                  aria-label="Upvote"
                  size="sm"
                  variant="ghost"
                  colorScheme={userVotes[comment.commentId] === 1 ? 'blue' : 'gray'}
                  onClick={() => handleVote(comment.commentId, 'up')}
                  isDisabled={!isAuthenticated}
                  borderRadius="full"
                />
                <IconButton
                  icon={<ChevronDownIcon boxSize={5} />}
                  aria-label="Downvote"
                  size="sm"
                  variant="ghost"
                  colorScheme={userVotes[comment.commentId] === -1 ? 'red' : 'gray'}
                  onClick={() => handleVote(comment.commentId, 'down')}
                  isDisabled={!isAuthenticated}
                  borderRadius="full"
                />
              </HStack>
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  );
};

export default CommentsSection;
