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

    const { user } = useAuth();

    const handleVote = async (
      e: React.MouseEvent<HTMLElement>,
      newVoteValue: VoteValue
    ) => {
      e.stopPropagation();
      if (votes.pending || !user) return;

      // Si on clique sur le même bouton, annuler le vote
      const sameVote = (newVoteValue === 1 && votes.current === 1) || 
                       (newVoteValue === -1 && votes.current === -1);
      
      setVotes((prev) => ({ ...prev, pending: true }));

      try {
        // Déterminer l'endpoint
        const voteAction = newVoteValue === 1 ? 'upvote' : 'downvote';
        const endpoint = `${voteType === "post" ? API_PATHS.POSTS : API_PATHS.COMMENTS}/${itemId}/${voteAction}`;

        // Faire l'appel API
        const response = await create<any>(endpoint, {});
        
        let newTotal = votes.total;
        let newCurrentVote = votes.current;
        
        if (response && response.total_votes !== undefined) {
          newTotal = response.total_votes;
          
          if (sameVote) {
            newCurrentVote = 0;
          } else {
            newCurrentVote = newVoteValue;
          }
        }

        setVotes({
          total: newTotal,
          current: newCurrentVote,
          pending: false,
        });

        if (onVoteChange) {
          onVoteChange(newCurrentVote, newTotal);
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