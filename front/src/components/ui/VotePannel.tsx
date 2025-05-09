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
        setVotes(prev => ({
          ...prev,
          total: totalVotes || 0,
          current: userVote || 0,
        }));
      }
    }, [totalVotes, userVote]);

    const { user } = useAuth();

    const handleVote = async (
      e: React.MouseEvent<HTMLElement>,
      voteDirection: 'upvote' | 'downvote'
    ) => {
      e.stopPropagation();
      
      if (!user) {
        alert("Vous devez être connecté pour voter");
        return;
      }
      
      if (votes.pending) return;

      const newVoteValue: VoteValue = voteDirection === 'upvote' ? 1 : -1;
      const isRemovingVote = (newVoteValue === 1 && votes.current === 1) || 
                            (newVoteValue === -1 && votes.current === -1);
      const isChangingVote = votes.current !== 0 && votes.current !== newVoteValue;
      
      let optimisticTotal = votes.total;
      let optimisticCurrent = votes.current;
      
      if (isRemovingVote) {
        optimisticTotal = newVoteValue === 1 ? optimisticTotal - 1 : optimisticTotal + 1;
        optimisticCurrent = 0;
      } else if (votes.current === 0) {
        optimisticTotal = newVoteValue === 1 ? optimisticTotal + 1 : optimisticTotal - 1;
        optimisticCurrent = newVoteValue;
      } else if (isChangingVote) {
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
        const endpoint = `${voteType === "post" ? API_PATHS.POSTS : API_PATHS.COMMENTS}/${itemId}/${voteDirection}`;
        const response = await create<any>(endpoint, {});
        
        if (response && response.total_votes !== undefined) {
          setVotes({
            total: response.total_votes,
            current: isRemovingVote ? 0 : newVoteValue,
            pending: false,
          });
          
          if (onVoteChange) {
            onVoteChange(isRemovingVote ? 0 : newVoteValue, response.total_votes);
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
          onClick={(e) => handleVote(e, 'upvote')}
          aria-label="Upvote"
          disabled={votes.pending}
        />
        <Body aria-live="polite">{votes.total}</Body>
        <LittleAction
          full={votes.current === -1}
          iconName="arrow_big_down"
          color="red"
          onClick={(e) => handleVote(e, 'downvote')}
          aria-label="Downvote"
          disabled={votes.pending}
        />
      </div>
    );
  }
);

VotePannel.displayName = "VotePannel";