import { useState, useEffect } from 'react';
import { Comment } from '../types/comment';
import { createWebSocketConnection } from '../services/websocketService';
import { config } from '../config';

// Type for our custom event
interface CustomEventDetail {
  changeType: string;
  comment: Comment;
}

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
        setComments((prevComments) => {
          if (prevComments.some((c) => c.commentId === comment.commentId)) {
            return prevComments.map(c => 
              c.commentId === comment.commentId ? comment : c
            );
          }
          return [...prevComments, comment];
        });
      }
    };

    if (config.USE_MOCKS) {
      // For mock implementation, listen to custom events
      console.log('Setting up mock WebSocket listeners for article:', articleId);
      
      // Safe type handling for custom events
      const handleMockWsMessage = (event: Event) => {
        const customEvent = event as CustomEvent<CustomEventDetail>;
        console.log('Received mock WS message:', customEvent.detail);
        if (customEvent.detail && customEvent.detail.comment) {
          handleNewComment(customEvent.detail.comment);
        }
      };
      
      window.addEventListener('mockWsMessage', handleMockWsMessage);
      
      return () => {
        window.removeEventListener('mockWsMessage', handleMockWsMessage);
      };
    } else {
      // Real WebSocket implementation
      const wsUrl = config.API_URL.replace('http', 'ws');
      const connection = createWebSocketConnection({
        url: `${wsUrl}/articles/${articleId}/comments`,
        onMessage: (data) => {
          if (data && data.comment) {
            handleNewComment(data.comment);
          }
        },
        onOpen: () => console.log("WebSocket connected"),
        onClose: () => console.log("WebSocket disconnected"),
        onError: (error) => console.error("WebSocket error:", error)
      });

      // Connect
      connection.connect();

      // Clean up
      return () => {
        connection.disconnect();
      };
    }
  }, [articleId]);

  const addComment = (commentId: string) => {
    console.log('Comment posted with ID:', commentId);
    // The actual comment will be added by the mock event
  };

  return { comments, addComment };
};

export default useWebSocketComments;
