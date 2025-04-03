import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Textarea,
  useToast,
  Alert,
  AlertDescription,
} from '@chakra-ui/react';
import { postComment } from '../../../api/commentApi';

interface CommentFormProps {
  articleId: string;
  onCommentPosted: (commentId: string) => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ articleId, onCommentPosted }) => {
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!content.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a comment',
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
        content
      });
      
      setContent('');
      onCommentPosted(newComment.commentId);
      
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

  return (
    <Box as="form" role="form" onSubmit={handleSubmit} mb={10} p={6} bg="gray.50" borderRadius="md">
      {error && (
        <Alert status="error" mb={6}>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <FormControl mb={4} isRequired>
        <FormLabel>Comment</FormLabel>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment..."
          minH="120px"
        />
      </FormControl>
      
      <Button
        type="submit"
        colorScheme="blue"
        isDisabled={!content.trim()}
        isLoading={submitting}
        loadingText="Posting..."
      >
        Post Comment
      </Button>
    </Box>
  );
};

export default CommentForm;
