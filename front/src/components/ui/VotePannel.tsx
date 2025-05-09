import React, { forwardRef, useState, useEffect } from "react";
import LittleAction from "./LittleAction";
import { create } from "@/lib/api/apiClient";
import { Body } from "./Typography";
import { API_PATHS } from "@/lib/api/config";
import { useAuth } from "@/providers/AuthProvider";

type TypeVote = "post" | "comment";
type VoteValue = -1 | 0 | 1;

interface VoteState {
  total: number;
  current: VoteValue;
  pending: boolean;
}

export interface VotePannelProps {
  voteType: TypeVote;
  itemId: string;
  voteId?: string;
  upVotes: number;
  downVotes: number;
  userVote: VoteValue;
  totalVotes: number;
  onVoteChange?: (newVote: VoteValue, newTotal: number) => void;
}

export const VotePannel = forwardRef<HTMLDivElement, VotePannelProps>(
  (
    { 
      voteType, 
      itemId, 
      upVotes, 
      downVotes, 
      userVote, 
      voteId, 
      totalVotes, 
      onVoteChange 
    },
    ref
  ) => {
    const [votes, setVotes] = useState<VoteState>({
      total: totalVotes || 0,
      current: userVote || 0,
      pending: false,
    });
    
    useEffect(() => {
      if (!votes.pending) {
        setVotes({
          total: totalVotes || 0,
          current: userVote || 0,
          pending: false,
        });
      }
    }, [totalVotes, userVote]);

    const { user } = useAuth();

    const handleVote = async (
      e: React.MouseEvent<HTMLElement>,
      newVoteValue: VoteValue
    ) => {
      e.stopPropagation();
      
      if (!user) {
        alert("Vous devez être connecté pour voter");
        return;
      }
      
      if (votes.pending) return;

      const sameVote = (newVoteValue === 1 && votes.current === 1) || 
                       (newVoteValue === -1 && votes.current === -1);
      
      let optimisticTotal = votes.total;
      let optimisticCurrent = votes.current;
      
      if (sameVote) {
        optimisticTotal = newVoteValue === 1 ? optimisticTotal - 1 : optimisticTotal + 1;
        optimisticCurrent = 0;
      } else if (votes.current === 0) {
        optimisticTotal = newVoteValue === 1 ? optimisticTotal + 1 : optimisticTotal - 1;
        optimisticCurrent = newVoteValue;
      } else {
        optimisticTotal = newVoteValue === 1 
          ? optimisticTotal + 2
          : optimisticTotal - 2;
        optimisticCurrent = newVoteValue;
      }
      
      setVotes({
        total: optimisticTotal,
        current: optimisticCurrent,
        pending: true,
      });
      
      if (onVoteChange) {
        onVoteChange(optimisticCurrent, optimisticTotal);
      }

      try {
        const voteAction = newVoteValue === 1 ? 'upvote' : 'downvote';
        const endpoint = `${voteType === "post" ? API_PATHS.POSTS : API_PATHS.COMMENTS}/${itemId}/${voteAction}`;

        const response = await create<any>(endpoint, {});
        
        if (response && response.total_votes !== undefined) {
          setVotes({
            total: response.total_votes,
            current: sameVote ? 0 : newVoteValue,
            pending: false,
          });
          
          if (onVoteChange) {
            onVoteChange(sameVote ? 0 : newVoteValue, response.total_votes);
          }
        } else {
          setVotes(prev => ({...prev, pending: false}));
        }
      } catch (error) {
        console.error("Vote failed:", error);
        setVotes({
          total: totalVotes,
          current: userVote,
          pending: false,
        });
        
        if (onVoteChange) {
          onVoteChange(userVote, totalVotes);
        }
      }
    };

    return (
      <div ref={ref} className="flex flex-row gap-1 items-center">
        <LittleAction
          full={votes.current === 1}
          iconName="arrow_big_up"
          color="blue"
          onClick={(e) => handleVote(e, 1)}
          aria-label="Upvote"
          disabled={votes.pending}
        />
        <Body aria-live="polite">{votes.total}</Body>
        <LittleAction
          full={votes.current === -1}
          iconName="arrow_big_down"
          color="red"
          onClick={(e) => handleVote(e, -1)}
          aria-label="Downvote"
          disabled={votes.pending}
        />
      </div>
    );
  }
);

VotePannel.displayName = "VotePannel";