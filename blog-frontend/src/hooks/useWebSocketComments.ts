import { useState, useEffect } from 'react';
import { Comment } from '../types/comment';
import { createWebSocketConnection } from '../services/websocketService';
import { config } from '../config';

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
            return prevComments;
          }
          return [...prevComments, comment];
        });
      }
    };

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

    connection.connect();

    return () => {
      connection.disconnect();
    };
  }, [articleId]);

  const addComment = (commentId: string) => {
    console.log('Comment posted with ID:', commentId);
  };

  return { comments, addComment };
};

export default useWebSocketComments;
