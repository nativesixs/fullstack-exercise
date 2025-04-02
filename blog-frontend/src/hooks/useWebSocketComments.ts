import { useState, useEffect } from 'react';
import { Comment } from '../types/comment';
import websocketService from '../services/websocketService';

/**
 * Custom hook to handle WebSocket comments
 * @param articleId - The ID of the article to get comments for
 * @param initialComments - Initial comments to display
 */
const useWebSocketComments = (articleId: string, initialComments: Comment[] = []) => {
  const [comments, setComments] = useState<Comment[]>(initialComments);

  // Update comments when initialComments change
  useEffect(() => {
    if (initialComments && initialComments.length > 0) {
      setComments(initialComments);
    }
  }, [initialComments]);

  useEffect(() => {
    // Function to handle new comments from the WebSocket
    const handleNewComment = (comment: Comment) => {
      // Only add comments for the current article
      if (comment.articleId === articleId) {
        setComments(prevComments => {
          // Check if the comment already exists to avoid duplicates
          if (prevComments.some(c => c.commentId === comment.commentId)) {
            return prevComments;
          }
          // Add the new comment to the list
          return [...prevComments, comment];
        });
      }
    };

    // Check if websocketService has the required methods before using them
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
      // Clean up by unsubscribing and disconnecting
      if (typeof websocketService.unsubscribeFromComments === 'function') {
        try {
          websocketService.unsubscribeFromComments(handleNewComment);
        } catch (error) {
          console.error('Error unsubscribing from comments:', error);
        }
      }
    };
  }, [articleId]);

  // Function to add a new comment (used when posting a comment locally)
  const addComment = (commentId: string) => {
    console.log('Comment posted with ID:', commentId);
    // The actual comment will be added by the WebSocket when the server broadcasts it
  };

  return { comments, addComment };
};

export default useWebSocketComments;
