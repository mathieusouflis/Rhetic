"use client";

import { ActionButton } from "@/components/ui/ActionButton";
import { Comment } from "@/components/ui/Comment";
import { Post } from "@/components/ui/Post";
import PostWriter from "@/components/ui/PostWriter";
import { Body } from "@/components/ui/Typography";
import { fetchOne } from "@/lib/api/apiClient";
import { API_PATHS } from "@/lib/api/config";
import { useAuth } from "@/providers/AuthProvider";
import { CommentType, PostType } from "@/types/post";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const { commentId }: { commentId: string } = useParams();
  const [comment, setComment] = useState<CommentType>();
  const router = useRouter();

  const { user } = useAuth();

  const handleBack = async () => {
    router.back();
  };

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const response = await fetchOne<CommentType>(
          API_PATHS.COMMENTS,
          commentId,
          {
            populate: {
              author: {
                fields: ["username"],
              },
              votes: {
                fields: ["type"],
                filters: {
                  user: {
                    id: {
                      $eq: user?.id,
                    },
                  },
                },
              },
              saved_items: {
                filters: {
                  users_permissions_user: {
                    id: {
                      $eq: user?.id,
                    },
                  },
                },
              },
              childrens: {
                populate: {
                  author: {
                    fields: ["username", "id"],
                  },
                  votes: {
                    fields: ["type"],
                    filters: {
                      user: {
                        id: {
                          $eq: user?.id,
                        },
                      },
                    },
                  },
                  saved_items: {
                    filters: {
                      users_permissions_user: {
                        id: {
                          $eq: user?.id,
                        },
                      },
                    },
                  },
                },
              },
            },
          }
        );

        setComment(response.data);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPostAndComments();
  }, [commentId]);

  return (
    <div className="flex flex-col gap-[21px]">
      <ActionButton
        variant="gray"
        leftIcon
        leftIconName="arrow_left"
        className="w-fit"
        onClick={handleBack}
      >
        <span className="font-semibold">Back</span>
      </ActionButton>
      {comment && <Comment comment={comment} fullPage />}
      <div className="w-full h-px bg-[var(--black-500)]"></div>
      <PostWriter type="comment" parent_type="comment" parent_id={commentId} />
      {Array.isArray(comment?.childrens) &&
      comment?.childrens &&
      comment.childrens.length > 0 ? (
        comment.childrens.map((children) => {
          return (
            <>
              <Comment comment={children} />;
            </>
          );
        })
      ) : (
        <Body className="text-center text-[var(--black-300)]">
          No comments yet
        </Body>
      )}
    </div>
  );
}
