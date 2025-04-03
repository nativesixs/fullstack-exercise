import React from 'react';
import { Box, Text, HStack, Avatar, IconButton } from '@chakra-ui/react';
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { formatDate } from '../../../utils/dateUtils';
import { Comment, VoteType, VoteValue } from '../../../types/comment';

interface CommentItemProps {
  comment: Comment;
  userVote: VoteValue;
  isAuthenticated: boolean;
  onVote: (commentId: string, voteType: VoteType) => Promise<void>;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  userVote,
  isAuthenticated,
  onVote,
}) => {
  return (
    <Box key={comment.commentId} p={6} bg="white" borderRadius="md" boxShadow="sm">
      <HStack spacing={4} mb={3}>
        <Avatar size="sm" name={comment.author} />
        <Text fontWeight="bold">{comment.author}</Text>
        <Text fontSize="sm" color="gray.500">
          {formatDate(comment.postedAt)}
        </Text>
      </HStack>

      <Text mb={4}>{comment.content}</Text>

      <HStack>
      <Text fontWeight="bold" fontSize="md" color={
          userVote === 1 ? "green.500" :
          userVote === -1 ? "red.500" :
          "gray.700"
        }>
          {comment.score}
        </Text>
        <IconButton
          aria-label="Upvote"
          icon={<ChevronUpIcon boxSize={6} />} 
          size="sm"
          variant="ghost"
          color={userVote === 1 ? "green.500" : "gray.500"}
          _hover={{ bg: "transparent", color: userVote === 1 ? "green.600" : "gray.600" }}
          onClick={() => onVote(comment.commentId, 'up')}
          isDisabled={!isAuthenticated}
          borderRadius="full"
        />

        <IconButton
          aria-label="Downvote"
          icon={<ChevronDownIcon boxSize={6} />}
          size="sm"
          variant="ghost"
          color={userVote === -1 ? "red.500" : "gray.500"}
          _hover={{ bg: "transparent", color: userVote === -1 ? "red.600" : "gray.600" }}
          onClick={() => onVote(comment.commentId, 'down')}
          isDisabled={!isAuthenticated}
          borderRadius="full"
        />
      </HStack>
    </Box>
  );
};

export default CommentItem;
