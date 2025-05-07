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
  const handleVote = (up: boolean) => {};

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
              s{/* {formatRelativeTime(comment.publishedAt)} */}
            </Small>
          </div>
          <Icon name="ellipsis" size={20} />
        </div>
        <div className="flex flex-col gap-1.5 w-full">
          <Small className="text-[var(--black-200)]">{comment.content}</Small>
        </div>
        {/* TODO: REGARDER S'IL Y A DES IMAGES ET LES FETCH SURTOUT */}
        {/* <ImageSet></ImageSet> */}
        <div className="flex flex-row justify-between w-full">
          <Link href={"/comments/" + comment.id}>
            <LittleAction iconName="comment" onClick={() => {}}>
              0
            </LittleAction>
          </Link>
          <LittleAction iconName="chart" color="white" onClick={() => {}}>
            0
          </LittleAction>
          <div className="flex flex-row gap-2">
            <Bookmark
              bookmarkType="comment"
              bookmarked={false}
              itemId={comment.id}
            />
            <Share shareType="comment" itemId={comment.id} />
          </div>
        </div>
      </div>
    </div>
  );
};
