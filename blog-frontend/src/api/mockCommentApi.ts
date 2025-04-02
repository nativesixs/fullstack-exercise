import { v4 as uuidv4 } from 'uuid';
import { Comment } from '../types/comment';

interface CommentData {
  articleId: string;
  author: string;
  content: string;
}

const mockComments: Record<string, Comment[]> = {};

try {
  const savedComments = localStorage.getItem('mockComments');
  if (savedComments) {
    Object.assign(mockComments, JSON.parse(savedComments));
    console.log('Loaded mock comments from localStorage:', mockComments);
  }
} catch (e) {
  console.error('Error loading mock comments from localStorage:', e);
}

const saveCommentsToLocalStorage = () => {
  try {
    localStorage.setItem('mockComments', JSON.stringify(mockComments));
  } catch (e) {
    console.error('Error saving mock comments to localStorage:', e);
  }
};

export const postComment = async (commentData: CommentData): Promise<Comment> => {
  try {
    console.log('Using MOCK: Posting comment with data:', commentData);
    
    const newComment: Comment = {
      commentId: uuidv4(),
      articleId: commentData.articleId,
      author: commentData.author,
      content: commentData.content,
      postedAt: new Date().toISOString(),
      score: 0
    };
    
    if (!mockComments[commentData.articleId]) {
      mockComments[commentData.articleId] = [];
    }
    mockComments[commentData.articleId].unshift(newComment);
    
    saveCommentsToLocalStorage();
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    window.dispatchEvent(new CustomEvent('mockWsMessage', { 
      detail: {
        changeType: 'commentCreated',
        comment: newComment
      }
    }));
    
    console.log('MOCK: Comment created successfully:', newComment);
    return newComment;
  } catch (error) {
    console.error('MOCK: Error creating comment:', error);
    throw error;
  }
};

export const upvoteComment = async (commentId: string): Promise<Comment> => {
  try {
    console.log('Using MOCK: Upvoting comment:', commentId);
    
    let updatedComment: Comment | null = null;
    
    for (const articleId in mockComments) {
      const commentIndex = mockComments[articleId].findIndex(c => c.commentId === commentId);
      if (commentIndex >= 0) {
        mockComments[articleId][commentIndex].score += 1;
        updatedComment = mockComments[articleId][commentIndex];
        break;
      }
    }
    
    if (!updatedComment) {
      throw new Error('Comment not found');
    }
    
    saveCommentsToLocalStorage();
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    window.dispatchEvent(new CustomEvent('mockWsMessage', { 
      detail: {
        changeType: 'commentUpVoted',
        comment: updatedComment
      }
    }));
    
    console.log('MOCK: Comment upvoted successfully:', updatedComment);
    return updatedComment;
  } catch (error) {
    console.error('MOCK: Error upvoting comment:', error);
    throw error;
  }
};

export const downvoteComment = async (commentId: string): Promise<Comment> => {
  try {
    console.log('Using MOCK: Downvoting comment:', commentId);
    
    let updatedComment: Comment | null = null;
    
    for (const articleId in mockComments) {
      const commentIndex = mockComments[articleId].findIndex(c => c.commentId === commentId);
      if (commentIndex >= 0) {
        mockComments[articleId][commentIndex].score -= 1;
        updatedComment = mockComments[articleId][commentIndex];
        break;
      }
    }
    
    if (!updatedComment) {
      throw new Error('Comment not found');
    }
    
    saveCommentsToLocalStorage();

    await new Promise(resolve => setTimeout(resolve, 300));
    
    window.dispatchEvent(new CustomEvent('mockWsMessage', { 
      detail: {
        changeType: 'commentDownVoted',
        comment: updatedComment
      }
    }));
    
    console.log('MOCK: Comment downvoted successfully:', updatedComment);
    return updatedComment;
  } catch (error) {
    console.error('MOCK: Error downvoting comment:', error);
    throw error;
  }
};

export const getCommentsForArticle = (articleId: string): Comment[] => {
  return mockComments[articleId] || [];
};
