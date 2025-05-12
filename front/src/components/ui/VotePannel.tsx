import React, { forwardRef, useState } from "react";
import LittleAction from "./LittleAction";
import { upvotePost, downvotePost, removeVote } from "@/lib/api/apiClient";
import { Body } from "./Typography";
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
  onVoteChange?: (newVote: VoteValue) => void;
}

export const VotePannel = forwardRef<HTMLDivElement, VotePannelProps>(
  (
    { voteType, itemId, upVotes, downVotes, userVote, voteId, onVoteChange },
    ref
  ) => {
    const [votes, setVotes] = useState<VoteState>({
      total: upVotes - downVotes,
      current: userVote,
      pending: false,
    });

    const [_voteId, setVoteId] = useState(voteId);
    const { user } = useAuth();

    const calculateVoteDelta = (
      oldVote: VoteValue,
      newVote: VoteValue
    ): number => {
      if (oldVote === newVote) return 0;
      if (newVote === 0) return -oldVote;
      if (oldVote === 0) return newVote;
      return newVote * 2;
    };

    const handleVote = async (
      e: React.MouseEvent<HTMLElement>,
      newVote: VoteValue
    ) => {
      e.stopPropagation();
      if (votes.pending) return;

      const voteToSubmit = votes.current === newVote ? 0 : newVote;

      setVotes((prev) => ({ ...prev, pending: true }));

      try {
        if (voteType === "post") {
          if (voteToSubmit === 0) {
            userVote === 1
              ? await downvotePost(itemId)
              : await upvotePost(itemId);
            setVoteId(undefined);
          } else if (voteToSubmit === 1) {
            const response = await upvotePost(itemId);
            if (response && response.id) {
              setVoteId(response.id);
            }
          } else if (voteToSubmit === -1) {
            const response = await downvotePost(itemId);
            if (response && response.id) {
              setVoteId(response.id);
            }
          }
        }

        const delta = calculateVoteDelta(votes.current, voteToSubmit);

        setVotes((prev) => ({
          total: prev.total + delta,
          current: voteToSubmit,
          pending: false,
        }));

        onVoteChange?.(voteToSubmit);
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
