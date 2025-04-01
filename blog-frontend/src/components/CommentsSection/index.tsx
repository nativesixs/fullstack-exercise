import React, { useState } from 'react';
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
  Flex
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { Comment } from '../../types/comment';
import { postComment, upvoteComment, downvoteComment } from '../../api/commentApi';

interface CommentsSectionProps {
  articleId: string;
  comments: Comment[];
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ articleId, comments = [] }) => {
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [localComments, setLocalComments] = useState<Comment[]>(comments);
  const toast = useToast();

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy • h:mm a');
    } catch (error) {
      return dateString;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      
      setLocalComments([newComment, ...localComments]);
      setAuthor('');
      setContent('');
      
      toast({
        title: 'Comment posted',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to post comment',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleVote = async (commentId: string, isUpvote: boolean) => {
    try {
      const updatedComment = isUpvote
        ? await upvoteComment(commentId)
        : await downvoteComment(commentId);
      
      setLocalComments(
        localComments.map(comment => 
          comment.commentId === commentId ? updatedComment : comment
        )
      );
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to vote on comment',
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
                    >
                      Upvote
                    </Button>
                    <Text fontWeight="bold">{comment.score}</Text>
                    <Button 
                      size="sm" 
                      onClick={() => handleVote(comment.commentId, false)}
                      colorScheme="red"
                      variant="outline"
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
