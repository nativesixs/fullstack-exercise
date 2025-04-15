import { useState } from 'react';
import { upvoteComment, downvoteComment } from '../api/commentApi';
import { UserVotes, VoteType, VoteValue } from '../types/comment';

export const useCommentVoting = (isAuthenticated: boolean) => {
  const [userVotes, setUserVotes] = useState<UserVotes>({});

  const handleVote = async (commentId: string, voteType: VoteType) => {
    if (!isAuthenticated) return;

    const currentVote = userVotes[commentId] || 0;
    let newVote: VoteValue = 0;

    try {
      // Reddit-style voting logic
      if (voteType === 'up') {
        // Case 1: User hasn't voted and clicks upvote
        if (currentVote === 0) {
          newVote = 1;
          await upvoteComment(commentId);
        }
        // Case 2: User already upvoted and clicks upvote again (toggle off)
        else if (currentVote === 1) {
          newVote = 0;
          await downvoteComment(commentId); // Cancel the previous upvote
        }
        // Case 3: User previously downvoted and clicks upvote
        else if (currentVote === -1) {
          newVote = 1;
          // Need to upvote twice to go from -1 to +1
          await upvoteComment(commentId);
          await upvoteComment(commentId);
        }
      } else {
        // Case 4: User hasn't voted and clicks downvote
        if (currentVote === 0) {
          newVote = -1;
          await downvoteComment(commentId);
        }
        // Case 5: User already downvoted and clicks downvote again (toggle off)
        else if (currentVote === -1) {
          newVote = 0;
          await upvoteComment(commentId); // Cancel the previous downvote
        }
        // Case 6: User previously upvoted and clicks downvote
        else if (currentVote === 1) {
          newVote = -1;
          // Need to downvote twice to go from +1 to -1
          await downvoteComment(commentId);
          await downvoteComment(commentId);
        }
      }

      // Use callback form to avoid state closure issues
      setUserVotes(prevVotes => {
        const updatedVotes: UserVotes = { ...prevVotes };
        updatedVotes[commentId] = newVote;
        return updatedVotes;
      });
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  return { userVotes, handleVote };
};
