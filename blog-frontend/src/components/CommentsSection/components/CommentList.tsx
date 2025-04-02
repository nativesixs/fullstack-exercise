import React from 'react';
import { Box, Text, VStack } from '@chakra-ui/react';
import { Comment, UserVotes, VoteType } from '../../../types/comment';
import CommentItem from './CommentItem';

interface CommentListProps {
  comments: Comment[];
  userVotes: UserVotes;
  isAuthenticated: boolean;
  onVote: (commentId: string, voteType: VoteType) => Promise<void>;
}

const CommentList: React.FC<CommentListProps> = ({ 
  comments,
  userVotes,
  isAuthenticated,
  onVote 
}) => {
  // Sort comments by date (newest first)
  const sortedComments = [...comments].sort(
    (a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
  );

  if (comments.length === 0) {
    return (
      <Box textAlign="center" py={8} bg="gray.50" borderRadius="md">
        <Text color="gray.500">No comments yet. Be the first to comment!</Text>
      </Box>
    );
  }

  return (
    <VStack spacing={6} align="stretch">
      {sortedComments.map((comment) => (
        <CommentItem
          key={comment.commentId}
          comment={comment}
          userVote={userVotes[comment.commentId] || 0}
          isAuthenticated={isAuthenticated}
          onVote={onVote}
        />
      ))}
    </VStack>
  );
};

export default CommentList;
