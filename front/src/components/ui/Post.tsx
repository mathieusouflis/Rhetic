"use client";

import { Avatar } from "./Avatar";
import Link from "next/link";
import { H2, Small } from "./Typography";
import Icon from "./Icons";
import LittleAction from "./LittleAction";
import { formatRelativeTime } from "@/lib/utils/date";
import { useRouter } from "next/navigation";
import classNames from "classnames";
import { Bookmark } from "./Bookmark";
import Share from "./Share";
import { VotePannel } from "./VotePannel";
import { PostType } from "@/types/post";
import Image from "next/image";
import { ImageSet, SetImage } from "./ImageSet";
import { API_CONFIG } from "@/config";

export interface PostProps {
  id: string;
  title: string;
  content: string;
  documentId: string;
  upvotes: number;
  downvotes: number;
  publishedAt: Date;
  user?: { id: number; username: string; avatarUrl?: string };
  images?: string[];
}

interface PostComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  post: PostType;
  fullPage?: boolean;
  className?: string;
}

export const Post = ({
  post,
  className,
  fullPage = false,
  ...props
}: PostComponentProps) => {
  const router = useRouter();
  const handlePostClick = () => {
    if (fullPage) return;

    router.push(`/posts/${post.documentId}`);
  };

  return (
    <div
      className={classNames(
        "flex flex-row w-full p-2.5 gap-2.5 cursor-pointe border border-transparent hover:bg-[var(--black-700)] hover:border-[var(--black-600)] rounded-[10px] radius-[10px] ",
        { "cursor-pointer": !fullPage },
        className
      )}
      onClick={handlePostClick}
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
              {/* TODO: Regarder si ça vient d'un sub ou si c'est un post de profile. */}
              {post.author?.username}
            </Small>
            <Small className="text-[var(--black-100)]">
              {formatRelativeTime(post.publishedAt)}
            </Small>
          </div>
          <Icon name="ellipsis" size={20} />
        </div>
        <div className="flex flex-col gap-1.5 w-full">
          <H2>{post.title}</H2>
          <Small className="text-[var(--black-200)]">{post.content}</Small>
        </div>
        <ImageSet>
          {post.Media?.map((image, index) => (
            <SetImage
              src={API_CONFIG.baseURL.split("/api")[0] + image.url}
              alt={image.alt || "Post image"}
              key={index}
            />
          ))}
        </ImageSet>
        <div className="flex flex-row justify-between w-full">
          <VotePannel
            voteType="post"
            itemId={post.id}
            upVotes={post.upvotes}
            downVotes={post.downvotes}
            voteId={post.votes[0]?.documentId}
            userVote={
              post.votes[0]?.type === "downvote"
                ? -1
                : post.votes[0]?.type === "upvote"
                ? 1
                : 0
            }
          />
          <Link href={"/posts/" + post.id}>
            <LittleAction iconName="comment">
              {!Array.isArray(post.comments)
                ? post.comments?.count
                : post.comments.length}
            </LittleAction>
          </Link>
          <LittleAction iconName="chart" color="white">
            {post.total_votes}
          </LittleAction>
          <div className="flex flex-row gap-2">
            <Bookmark
              bookmarkType="post"
              bookmarked={post.saved_items?.length > 0}
              bookmarkId={post.saved_items && post.saved_items[0]?.documentId}
              itemId={post.documentId}
            />
            <Share shareType="post" itemId={post.id} />
          </div>
        </div>
      </div>
    </div>
  );
};
