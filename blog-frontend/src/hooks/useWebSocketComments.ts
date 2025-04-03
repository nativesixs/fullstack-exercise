import { useState, useEffect } from 'react';
import { Comment } from '../types/comment';
import websocketService from '../services/websocketService';

const useWebSocketComments = (articleId: string, initialComments: Comment[] = []) => {
  const [comments, setComments] = useState<Comment[]>(initialComments);

  useEffect(() => {
    if (initialComments && initialComments.length > 0) {
      setComments(initialComments);
    }
  }, [initialComments]);

  useEffect(() => {
    const handleNewComment = (comment: Comment) => {
      if (comment.articleId === articleId) {
        setComments(prevComments => {
          if (prevComments.some(c => c.commentId === comment.commentId)) {
            return prevComments;
          }
          return [...prevComments, comment];
        });
      }
    };

    if (typeof websocketService.connect === 'function') {
      try {
        websocketService.connect();
      } catch (error) {
        console.error('Error connecting to WebSocket:', error);
      }
    }
    
    if (typeof websocketService.subscribeToComments === 'function') {
      try {
        websocketService.subscribeToComments(handleNewComment);
      } catch (error) {
        console.error('Error subscribing to comments:', error);
      }
    }

    return () => {
      if (typeof websocketService.unsubscribeFromComments === 'function') {
        try {
          websocketService.unsubscribeFromComments(handleNewComment);
        } catch (error) {
          console.error('Error unsubscribing from comments:', error);
        }
      }
    };
  }, [articleId]);

  const addComment = (commentId: string) => {
    console.log('Comment posted with ID:', commentId);
  };

  return { comments, addComment };
};

export default useWebSocketComments;
