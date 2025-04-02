import { useState } from 'react';
import { upvoteComment, downvoteComment } from '../api/commentApi';
import { UserVotes, VoteType } from '../types/comment';

export const useCommentVoting = (isAuthenticated: boolean) => {
  const [userVotes, setUserVotes] = useState<UserVotes>({});

  const handleVote = async (commentId: string, voteType: VoteType) => {
    if (!isAuthenticated) return;
    
    try {
      if (voteType === 'up') {
        await upvoteComment(commentId);
        setUserVotes({
          ...userVotes,
          [commentId]: 1
        });
      } else {
        await downvoteComment(commentId);
        setUserVotes({
          ...userVotes,
          [commentId]: -1
        });
      }
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  return { userVotes, handleVote };
};
