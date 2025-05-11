"use client";

import { ActionButton } from "@/components/ui/ActionButton";
import { Comment } from "@/components/ui/Comment";
import { Post } from "@/components/ui/Post";
import PostWriter from "@/components/ui/PostWriter";
import { Body } from "@/components/ui/Typography";
import { fetchOne } from "@/lib/api/apiClient";
import { API_PATHS } from "@/lib/api/config";
import { useAuth } from "@/providers/AuthProvider";
import { PostType } from "@/types/post";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const { postId }: { postId: string } = useParams();
  const [post, setPost] = useState<PostType>();
  const router = useRouter();

  const { user } = useAuth();

  const handleBack = async () => {
    router.back();
  };

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const response = await fetchOne<PostType>(API_PATHS.POSTS, postId, {
          populate: {
            Media: true,
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
            comments: {
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
        });

        setPost(response.data);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPostAndComments();
  }, [postId]);

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
      {post && <Post post={post} fullPage />}
      <div className="w-full h-px bg-[var(--black-500)]"></div>
      <PostWriter type="comment" parent_type="post" parent_id={postId} />
      {Array.isArray(post?.comments) &&
      post?.comments &&
      post.comments.length > 0 ? (
        post.comments.map((comment) => {
          return <Comment key={comment.documentId} comment={comment} />;
        })
      ) : (
        <Body className="text-center text-[var(--black-300)]">
          No comments yet
        </Body>
      )}
    </div>
  );
}
