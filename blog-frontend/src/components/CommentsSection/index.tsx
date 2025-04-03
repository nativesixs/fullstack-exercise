import React from 'react';
import { useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Heading,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
} from '@chakra-ui/react';
import { RootState } from '../../store/store';
import { Comment } from '../../types/comment';
import CommentForm from './components/CommentForm';
import CommentList from './components/CommentList';
import { useCommentVoting } from '../../hooks/useCommentVoting';
import useWebSocketComments from '../../hooks/useWebSocketComments';

interface CommentsSectionProps {
  articleId: string;
  comments?: Comment[];
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ articleId, comments = [] }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { userVotes, handleVote } = useCommentVoting(isAuthenticated);
  const { comments: localComments, addComment } = useWebSocketComments(articleId, comments);

  return (
    <Box as="section" pt={10}>
      <Heading as="h2" size="lg" mb={6}>
        Comments
      </Heading>

      {!isAuthenticated && (
        <Alert status="info" mb={6} borderRadius="md">
          <AlertIcon />
          <Box>
            <AlertTitle>Want to join the conversation?</AlertTitle>
            <AlertDescription>
              Please{' '}
              <Button
                as={RouterLink}
                to="/login"
                variant="link"
                colorScheme="blue"
                fontWeight="semibold"
              >
                log in
              </Button>{' '}
              to post comments.
            </AlertDescription>
          </Box>
        </Alert>
      )}

      {isAuthenticated && (
        <CommentForm 
          articleId={articleId} 
          onCommentPosted={addComment} 
        />
      )}

      <CommentList
        comments={localComments}
        userVotes={userVotes}
        onVote={handleVote}
        isAuthenticated={isAuthenticated}
      />
    </Box>
  );
};

export default CommentsSection;
