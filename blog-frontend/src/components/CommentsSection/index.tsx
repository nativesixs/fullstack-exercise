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

const USER_VOTES_KEY = 'user_comment_votes';
type UserVotes = Record<string, 1 | 0 | -1>;

const getStoredUserVotes = (): UserVotes => {
  try {
    const storedVotes = localStorage.getItem(USER_VOTES_KEY);
    return storedVotes ? JSON.parse(storedVotes) : {};
  } catch (e) {
    console.error('Error loading user votes:', e);
    return {};
  }
};

const saveUserVotes = (votes: UserVotes) => {
  try {
    localStorage.setItem(USER_VOTES_KEY, JSON.stringify(votes));
  } catch (e) {
    console.error('Error saving user votes:', e);
  }
};

const CommentsSection: React.FC<CommentsSectionProps> = ({ articleId, comments = [] }) => {
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [localComments, setLocalComments] = useState<Comment[]>(comments);
  const [error, setError] = useState<string | null>(null);
  const [userVotes, setUserVotes] = useState<UserVotes>(getStoredUserVotes());
  
  const processedCommentIds = useRef(new Set<string>());
  
  const toast = useToast();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const username = 'Admin';

  useEffect(() => {
    if (comments.length > 0) {
      const idSet = new Set<string>();
      comments.forEach(comment => idSet.add(comment.commentId));
      processedCommentIds.current = idSet;
      setLocalComments(comments);
    }
  }, [comments]);

  useEffect(() => {
    const handleCommentEvent = (event: { changeType: string; comment: Comment }) => {
      if (event.comment.articleId === articleId) {
        if (event.changeType === 'commentCreated') {
          if (processedCommentIds.current.has(event.comment.commentId)) {
            console.log('Skipping already processed comment', event.comment.commentId);
            return;
          }
          
          processedCommentIds.current.add(event.comment.commentId);
          
          setLocalComments(prevComments => [event.comment, ...prevComments]);
          
          if (event.comment.author !== username) {
            toast({
              title: 'New comment',
              description: 'Someone just added a new comment',
              status: 'info',
              duration: 3000,
              isClosable: true,
            });
          }
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
  }, [articleId, toast, username]);

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
    
    if (!content.trim()) {
      toast({
        title: 'Error',
        description: 'Comment text is required',
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

  const handleVote = async (commentId: string, voteType: 'up' | 'down') => {
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
      let newVoteState: 1 | 0 | -1;
      let apiActions: Array<() => Promise<Comment>> = [];

      if (voteType === 'up') {
        if (currentVote === 1) {
          newVoteState = 0;
          apiActions.push(() => downvoteComment(commentId));
        } else if (currentVote === -1) {
          newVoteState = 1;
          apiActions.push(() => upvoteComment(commentId));
          apiActions.push(() => upvoteComment(commentId));
        } else {
          newVoteState = 1;
          apiActions.push(() => upvoteComment(commentId));
        }
      } else { 
        if (currentVote === -1) {
          newVoteState = 0;
          apiActions.push(() => upvoteComment(commentId));
        } else if (currentVote === 1) {
          newVoteState = -1;
          apiActions.push(() => downvoteComment(commentId));
          apiActions.push(() => downvoteComment(commentId));
        } else {
          newVoteState = -1;
          apiActions.push(() => downvoteComment(commentId));
        }
      }

      for (const action of apiActions) {
        await action();
      }

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
              rows={4}
              bg="white"
            />
          </FormControl>
          
          <Button
            type="submit"
            colorScheme="blue"
            isLoading={submitting}
            loadingText="Posting"
          >
            Post Comment
          </Button>
        </Box>
      )}
      
      {localComments.length > 0 ? (
        <VStack spacing={6} align="stretch">
          {localComments.map((comment) => (
            <Box 
              key={comment.commentId} 
              p={6}
              bg="white"
              borderRadius="md"
              boxShadow="sm"
            >
              <Box mb={4}>
                <HStack mb={2}>
                  <Avatar size="sm" name={comment.author} />
                  <Text fontWeight="bold">{comment.author}</Text>
                  <Text color="gray.500" fontSize="sm">
                    {formatDate(comment.postedAt)}
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
