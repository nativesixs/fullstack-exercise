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
  comments: Comment[];
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ articleId, comments = [] }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { userVotes, handleVote } = useCommentVoting(isAuthenticated);
  const { comments: localComments, addComment } = useWebSocketComments(articleId, comments);

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
            You need to{' '}
            <Button as={RouterLink} to="/login" colorScheme="blue" size="sm" ml={2}>
              login
            </Button>
            to post comments and vote.
          </AlertDescription>
        </Alert>
      )}

      {isAuthenticated && <CommentForm articleId={articleId} onCommentPosted={addComment} />}

      <CommentList
        comments={localComments}
        userVotes={userVotes}
        isAuthenticated={isAuthenticated}
        onVote={handleVote}
      />
    </Box>
  );
};

export default CommentsSection;
