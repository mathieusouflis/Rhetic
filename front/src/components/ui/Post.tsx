"use client";

import { Avatar } from "./Avatar";
import Link from "next/link";
import { H2, Small, Body } from "./Typography";
import Icon from "./Icons";
import LittleAction from "./LittleAction";
import { formatRelativeTime } from "@/lib/utils/date";
import { useRouter } from "next/navigation";
import classNames from "classnames";
import { Bookmark } from "./Bookmark";
import Share from "./Share";
import { VotePannel } from "./VotePannel";
import { PostType } from "@/types/post";
import { ImageSet, SetImage } from "./ImageSet";
import { API_CONFIG, ENV, ICONS } from "@/config";
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
} from "./Dropdown";
import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { remove } from "@/lib/api/apiClient";
import { API_PATHS } from "@/lib/api/config";
import PostEditModal from "./PostEditModal/PostEditModal";
import Tag from "./Tag";

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
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const handlePostClick = () => {
    if (fullPage) return;
    router.push(`/posts/${post.documentId}`);
  };

  const isAuthor = user?.id === (post.author?.id || post.user?.id);

  const handleDelete = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsMenuOpen(false);

    if (!confirm("Êtes-vous sûr de vouloir supprimer ce post ?")) {
      return;
    }

    try {
      await remove(API_PATHS.POSTS, post.id);
      if (fullPage) {
        router.push("/");
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du post:", error);
    }
  };

  const handleEdit = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsMenuOpen(false);
    setShowEditModal(true);
  };

  const handleEditSuccess = () => {
    window.location.reload();
  };

  return (
    <>
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
          src={
            post.author?.avatar?.url
              ? post.author?.avatar?.url
              : ICONS.default_user
          }
          alt="avatar"
          size="md"
        />
        <div className="flex flex-col gap-3 w-full">
          <div className="flex flex-row justify-between w-full">
            <div className="flex flex-row gap-3 items-center">
              <Small className="font-semibold text-[var(--black-100)]">
                {post.subrhetic ? (
                  <>
                    <Link
                      onClick={(e) => e.stopPropagation()}
                      href={"/communities/" + post.subrhetic.documentId}
                      className="hover:underline"
                    >
                      r/{post.subrhetic.name}
                    </Link>{" "}
                    →{" "}
                    <Link
                      onClick={(e) => e.stopPropagation()}
                      href={"/users/" + post.author?.id}
                      className="text-[var(--black-200)] hover:underline"
                    >
                      {post.author?.username}
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      onClick={(e) => e.stopPropagation()}
                      href={"/users/" + post.author?.id}
                      className="hover:underline"
                    >
                      {post.author?.username}
                    </Link>
                  </>
                )}
              </Small>
              {["9", "10", 9, 10].includes(
                post.author?.id ? post.author?.id : ""
              ) && <Tag variant="default" name="king" />}
              <Small className="text-[var(--black-100)]">
                {formatRelativeTime(post.publishedAt)}
              </Small>
            </div>
            <div onClick={(e) => e.stopPropagation()}>
              <Dropdown isOpen={isMenuOpen} setIsOpen={setIsMenuOpen}>
                <DropdownTrigger
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  isOpen={isMenuOpen}
                  className="cursor-pointer"
                >
                  <Icon name="ellipsis" size={20} />
                </DropdownTrigger>

                {isMenuOpen && (
                  <DropdownContent className="z-50 right-0 absolute w-max">
                    {isAuthor && (
                      <>
                        <DropdownItem onClick={() => handleEdit()}>
                          <div className="flex items-center gap-2">
                            <Icon name="edit" size={16} color="var(--white)" />
                            <Body>Modifier</Body>
                          </div>
                        </DropdownItem>
                        <DropdownItem onClick={() => handleDelete()}>
                          <div className="flex items-center gap-2">
                            <Icon name="trash" size={16} color="var(--red)" />
                            <Body className="text-[var(--red)]">Supprimer</Body>
                          </div>
                        </DropdownItem>
                      </>
                    )}
                    {/* <DropdownItem
                      onClick={() => {
                        setIsMenuOpen(false);
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Icon name="flag" size={16} color="var(--red)" />
                        <Body className="text-[var(--red)]">Signaler</Body>
                      </div>
                    </DropdownItem> */}
                  </DropdownContent>
                )}
              </Dropdown>
            </div>
          </div>
          <div className="flex flex-col gap-1.5 w-full">
            <H2>{post.title}</H2>
            <Small
              className={classNames({
                "text-[var(--black-200)]": post.title !== null,
                "text-[var(--white)]": post.title === null,
              })}
            >
              {post.content}
            </Small>
          </div>
          <ImageSet>
            {post.Media &&
              post.Media.length > 0 &&
              post.Media.map((image, index) => (
                <SetImage
                  src={image.url}
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
              voteId={post.votes && post.votes[0]?.documentId}
              userVote={
                post.votes && post.votes[0]?.type === "downvote"
                  ? -1
                  : post.votes && post.votes[0]?.type === "upvote"
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
              {post.upvotes + post.downvotes}
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

      {showEditModal && (
        <PostEditModal
          post={post}
          onClose={() => setShowEditModal(false)}
          onSuccess={handleEditSuccess}
        />
      )}
    </>
  );
};
