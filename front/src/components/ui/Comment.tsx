"use client";

import { Avatar } from "./Avatar";
import Link from "next/link";
import { Small } from "./Typography";
import Icon from "./Icons";
import LittleAction from "./LittleAction";
import { formatRelativeTime } from "@/lib/utils/date";
import { useRouter } from "next/navigation";
import classNames from "classnames";
import { Bookmark } from "./Bookmark";
import Share from "./Share";
import { CommentType } from "@/types/post";
import { VotePannel } from "./VotePannel";
import { useState } from "react";

export interface CommentProps {
  id: string;
  content: string;
  documentId: string;
  upvotes: number;
  downvotes: number;
  publishedAt: Date;
  user?: { id: number; username: string; avatarUrl?: string };
}

interface CommentComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  comment: CommentType;
  fullPage?: boolean;
  className?: string;
}

export const Comment = ({
  comment: initialComment,
  className,
  fullPage = false,
  ...props
}: CommentComponentProps) => {
  const [comment, setComment] = useState<CommentType>(initialComment);
  const router = useRouter();

  const handleCommentClick = () => {
    if (fullPage) return;
    router.push(`/comments/${comment.id}`);
  };

  const handleVoteChange = (newVote: -1 | 0 | 1, newTotal: number, newScore: number) => {
    setComment((prevComment) => ({
      ...prevComment,
      upvotes: newVote === 1 
        ? (prevComment.current === 1 ? prevComment.upvotes : prevComment.upvotes + 1)
        : (prevComment.current === 1 ? prevComment.upvotes - 1 : prevComment.upvotes),
      downvotes: newVote === -1 
        ? (prevComment.current === -1 ? prevComment.downvotes : prevComment.downvotes + 1)
        : (prevComment.current === -1 ? prevComment.downvotes - 1 : prevComment.downvotes),
      total_votes: newScore
    }));
  };

  return (
    <div
      className={classNames(
        "flex flex-row w-full p-2.5 gap-2.5 cursor-pointe border border-transparent hover:bg-[var(--black-700)] hover:border-[var(--black-600)] rounded-[10px] radius-[10px] ",
        { "cursor-pointer": !fullPage },
        className
      )}
      onClick={handleCommentClick}
      {...props}
    >
      <Avatar
        src="https://images.unsplash.com/photo-1726066012604-a309bd0575df?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="avatar"
        size="md"
      />
      <div className="flex flex-col gap-3 w-full">
        <div className="flex flex-row justify-between w-full">
          <div className="flex flex-row gap-3">
            <Small className="font-semibold text-[var(--black-100)]">
              {comment.author?.username}
            </Small>
            <Small className="text-[var(--black-100)]">
              {formatRelativeTime(comment.publishedAt)}
            </Small>
          </div>
          <Icon name="ellipsis" size={20} />
        </div>
        <div className="flex flex-col gap-1.5 w-full">
          <Small className="text-[var(--black-200)]">{comment.content}</Small>
        </div>
        <div className="flex flex-row justify-between w-full">
          <VotePannel
            voteType="comment"
            itemId={comment.id}
            downVotes={comment.downvotes || 0}
            upVotes={comment.upvotes || 0}
            totalVotes={comment.total_votes || 0}
            voteId={comment.votes && comment.votes[0]?.id?.toString()}
            userVote={
              comment.votes && comment.votes[0]?.type === "downvote"
                ? -1
                : comment.votes && comment.votes[0]?.type === "upvote"
                ? 1
                : 0
            }
            onVoteChange={handleVoteChange}
          />
          <Link href={"/comments/" + comment.id}>
            <LittleAction iconName="comment" onClick={(e) => e.stopPropagation()}>
              {comment.childrens?.length || 0}
            </LittleAction>
          </Link>
          <LittleAction iconName="chart" color="white" onClick={(e) => e.stopPropagation()}>
            {comment.upvotes + comment.downvotes}
          </LittleAction>
          <div className="flex flex-row gap-2">
            <Bookmark
              bookmarkType="comment"
              bookmarked={
                Array.isArray(comment.saved_items) &&
                comment.saved_items.length > 0
              }
              bookmarkId={
                (Array.isArray(comment.saved_items) &&
                  comment.saved_items[0]?.id?.toString()) ||
                undefined
              }
              itemId={comment.id}
            />
            <Share shareType="comment" itemId={comment.id} />
          </div>
        </div>
      </div>
    </div>
  );
};