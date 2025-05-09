import React, { forwardRef, useState, useEffect } from "react";
import LittleAction from "./LittleAction";
import { create } from "@/lib/api/apiClient";
import { Body } from "./Typography";
import { API_PATHS } from "@/lib/api/config";
import { useAuth } from "@/providers/AuthProvider";

type TypeVote = "post" | "comment";
type VoteValue = -1 | 0 | 1;

interface VoteState {
  score: number;
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
  onVoteChange?: (newVote: VoteValue, newTotal: number, newScore: number) => void;
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
      score: upVotes - downVotes,
      current: userVote || 0,
      pending: false,
    });
    
    useEffect(() => {
      if (!votes.pending) {
        setVotes(prev => ({
          ...prev,
          score: upVotes - downVotes,
          current: userVote || 0,
        }));
      }
    }, [upVotes, downVotes, userVote]);

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
      
      let optimisticScore = votes.score;
      let optimisticCurrent = votes.current;
      let optimisticTotal = upVotes + downVotes;
      
      if (isRemovingVote) {
        if (newVoteValue === 1) {
          optimisticScore -= 1;
          optimisticTotal -= 1;
        } else {
          optimisticScore += 1;
          optimisticTotal -= 1;
        }
        optimisticCurrent = 0;
      } else if (votes.current === 0) {
        if (newVoteValue === 1) {
          optimisticScore += 1;
          optimisticTotal += 1;
        } else {
          optimisticScore -= 1;
          optimisticTotal += 1;
        }
        optimisticCurrent = newVoteValue;
      } else if (isChangingVote) {
        if (newVoteValue === 1) {
          optimisticScore += 2;
        } else {
          optimisticScore -= 2;
        }
        optimisticCurrent = newVoteValue;
      }
      
      setVotes({
        score: optimisticScore,
        current: optimisticCurrent,
        pending: true,
      });
      
      if (onVoteChange) {
        onVoteChange(optimisticCurrent, optimisticTotal, optimisticScore);
      }

      try {
        const endpoint = `${voteType === "post" ? API_PATHS.POSTS : API_PATHS.COMMENTS}/${itemId}/${voteDirection}`;
        const response = await create<any>(endpoint, {});
        
        if (response) {
          const serverUpvotes = response.upvotes || 0;
          const serverDownvotes = response.downvotes || 0;
          const serverTotal = serverUpvotes + serverDownvotes;
          const serverScore = serverUpvotes - serverDownvotes;
          
          setVotes({
            score: serverScore,
            current: isRemovingVote ? 0 : newVoteValue,
            pending: false,
          });
          
          if (onVoteChange) {
            onVoteChange(
              isRemovingVote ? 0 : newVoteValue, 
              serverTotal,
              serverScore
            );
          }
        } else {
          setVotes(prev => ({...prev, pending: false}));
        }
      } catch (error) {
        console.error("Vote failed:", error);
        setVotes({
          score: upVotes - downVotes,
          current: userVote,
          pending: false,
        });
        
        if (onVoteChange) {
          onVoteChange(userVote, upVotes + downVotes, upVotes - downVotes);
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
        <Body aria-live="polite">{votes.score}</Body>
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