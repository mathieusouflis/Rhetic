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
import { ICONS } from "@/config";

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
  comment,
  className,
  fullPage = false,
  ...props
}: CommentComponentProps) => {
  const router = useRouter();

  const handleCommentClick = () => {
    if (fullPage) return;

    router.push(`/comments/${comment.documentId}`);
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
      <Avatar src={ICONS.default_user} alt="avatar" size="md" />
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
            downVotes={comment.downvotes}
            upVotes={comment.upvotes}
            itemId={comment.documentId}
            voteId={comment.votes[0]?.documentId}
            userVote={
              comment.votes[0]?.type === "downvote"
                ? -1
                : comment.votes[0]?.type === "upvote"
                ? 1
                : 0
            }
          />
          <Link href={"/comments/" + comment.id}>
            <LittleAction iconName="comment" onClick={() => {}}>
              {comment.childrens?.length || 0}
            </LittleAction>
          </Link>
          <LittleAction iconName="chart" color="white" onClick={() => {}}>
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
                  comment.saved_items[0]?.documentId) ||
                undefined
              }
              itemId={comment.documentId}
            />
            <Share shareType="comment" itemId={comment.id} />
          </div>
        </div>
      </div>
    </div>
  );
};
