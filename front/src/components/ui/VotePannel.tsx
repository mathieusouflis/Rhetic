import React, { forwardRef, useState, useEffect } from "react";
import LittleAction from "./LittleAction";
import { create, remove, update } from "@/lib/api/apiClient";
import { Body } from "./Typography";
import { API_PATHS } from "@/lib/api/config";
import { VoteType } from "@/types/post";
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
      total: totalVotes,
      current: userVote,
      pending: false,
    });
    
    useEffect(() => {
      setVotes({
        total: totalVotes,
        current: userVote,
        pending: false,
      });
    }, [totalVotes, userVote]);

    const [_voteId, setVoteId] = useState(voteId);
    const { user } = useAuth();

    const calculateVoteDelta = (
      oldVote: VoteValue,
      newVote: VoteValue
    ): number => {
      if (newVote === 0) {
        return oldVote === 1 ? -1 : 1;
      }
      
      if (oldVote === 0) {
        return newVote;
      }
      
      if (oldVote === 1 && newVote === -1) {
        return -2;
      }
      
      if (oldVote === -1 && newVote === 1) {
        return 2;
      }
      
      return 0;
    };

    const handleVote = async (
      e: React.MouseEvent<HTMLElement>,
      newVote: VoteValue
    ) => {
      e.stopPropagation();
      if (votes.pending || !user) return;

      const voteToSubmit = votes.current === newVote ? 0 : newVote;

      setVotes((prev) => ({ ...prev, pending: true }));

      try {
        const endpoint = voteType === "post" 
          ? `${API_PATHS.POSTS}/${itemId}/${voteToSubmit === 1 ? 'upvote' : 'downvote'}`
          : `${API_PATHS.COMMENTS}/${itemId}/${voteToSubmit === 1 ? 'upvote' : 'downvote'}`;

        if (voteToSubmit === 0) {
          const response = await create<any>(endpoint, {});
          setVoteId(undefined);
        } else {
          const response = await create<any>(endpoint, {});
          
          if (response && response.vote) {
            setVoteId(response.vote.id.toString());
          }
        }

        const delta = calculateVoteDelta(votes.current, voteToSubmit);
        const newTotal = votes.total + delta;

        setVotes({
          total: newTotal,
          current: voteToSubmit,
          pending: false,
        });

        if (onVoteChange) {
          onVoteChange(voteToSubmit, newTotal);
        }
      } catch (error) {
        console.error("Vote failed:", error);
        setVotes((prev) => ({ ...prev, pending: false }));
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