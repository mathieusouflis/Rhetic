"use client";

import { ActionButton } from "@/components/ui/ActionButton";
import { Comment } from "@/components/ui/Comment";
import { Post } from "@/components/ui/Post";
import PostWriter from "@/components/ui/PostWriter";
import { Body } from "@/components/ui/Typography";
import { fetchOne, fetchMany } from "@/lib/api/apiClient";
import { API_PATHS } from "@/lib/api/config";
import { useAuth } from "@/providers/AuthProvider";
import { PostType } from "@/types/post";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { Button } from "@/components/ui/Button";
import LoaderSkeleton from "@/components/ui/LoaderSkeleton";
import { toastUtils } from "@/lib/utils/toast";

export default function Page() {
  const { postId }: { postId: string } = useParams();
  const [post, setPost] = useState<PostType>();
  const [comments, setComments] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const PAGE_SIZE = 10;
  const router = useRouter();

  const { user } = useAuth();

  const handleBack = async () => {
    router.back();
  };

  const loadPost = async (isRefreshing = false) => {
    try {
      if (isRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const toastId = isRefreshing
        ? toastUtils.loading("Actualisation du post...")
        : undefined;

      const response = await fetchOne<PostType>(API_PATHS.POSTS, postId, {
        populate: {
          Media: true,
          author: {
            fields: ["username"],
            populate: {
              avatar: {
                fields: ["url"],
              },
            },
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
          comments: {
            count: true,
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
          subrhetic: {
            fields: ["name", "documentId"],
          },
        },
      });

      setPost(response.data);

      await loadMoreComments(1, false);

      if (toastId) {
        toastUtils.success("Post actualisé", toastId);
      }
    } catch (error: any) {
      console.error("Error fetching post:", error);
      setError(
        error.message || "Une erreur est survenue lors du chargement du post"
      );
      if (refreshing) {
        toastUtils.error("Échec de l'actualisation");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadMoreComments = async (pageNum: number, append: boolean = true) => {
    try {
      if (pageNum > 1) {
        setLoadingMore(true);
      }

      const response = await fetchMany<any>(API_PATHS.COMMENTS, {
        sort: ["createdAt:desc"],
        pagination: {
          page: pageNum,
          pageSize: PAGE_SIZE,
        },
        filters: {
          post: {
            documentId: {
              $eq: postId,
            },
          },
        },
        populate: {
          childrens: true,
          author: {
            fields: ["username", "id"],
            populate: {
              avatar: {
                fields: ["url"],
              },
            },
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
      });

      const fetchedComments = response.data || [];

      if (append && pageNum > 1) {
        setComments((prevComments) => [...prevComments, ...fetchedComments]);
      } else {
        setComments(fetchedComments);
      }

      const totalPages = response.meta?.pagination?.pageCount || 1;
      setHasMore(pageNum < totalPages);
    } catch (error: any) {
      console.error("Error fetching comments:", error);
      if (pageNum === 1 && !append) {
        setError(
          error.message ||
            "Une erreur est survenue lors du chargement des commentaires"
        );
      }
    } finally {
      setLoadingMore(false);
    }
  };

  const refreshPost = async () => {
    if (refreshing) return;

    if (error) {
      setError("");
    }

    setPage(1);
    await loadPost(true);
  };

  const loadMore = () => {
    if (loadingMore || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    loadMoreComments(nextPage, true);
  };

  const { loaderRef } = useInfiniteScroll(loadMore, hasMore);

  useEffect(() => {
    loadPost();
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

      {loading && !post ? (
        <div className="flex flex-col items-center gap-3 py-8">
          <LoaderSkeleton size="lg" />
          <span className="text-[var(--black-300)]">Chargement du post...</span>
        </div>
      ) : error && !post ? (
        <div className="mb-4 p-4 bg-red-900/30 border border-red-800/50 rounded-md">
          <div className="flex items-start">
            <div className="flex-shrink-0 mr-3 text-red-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-red-400 font-medium">Erreur de chargement</p>
              <p className="text-red-300 text-sm mt-1">{error}</p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-3"
                onClick={() => refreshPost()}
                leftIcon="refresh"
              >
                Réessayer
              </Button>
            </div>
          </div>
        </div>
      ) : post ? (
        <>
          <div className="flex justify-end mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={refreshPost}
              disabled={refreshing}
              leftIcon={refreshing ? "spinner" : "refresh"}
              iconClassName={refreshing ? "animate-spin" : ""}
            >
              {refreshing ? "Actualisation..." : "Actualiser"}
            </Button>
          </div>
          <Post post={post} fullPage />
          <div className="w-full h-px bg-[var(--black-500)]"></div>
          <PostWriter type="comment" parent_type="post" parent_id={postId} />

          <div className="mt-4">
            <h3 className="text-lg font-medium mb-4">Commentaires</h3>

            {comments.length > 0 ? (
              <div className="flex flex-col gap-4">
                {comments.map((comment) => (
                  <div
                    key={comment.documentId || comment.id}
                    className="flex flex-col gap-2"
                  >
                    <Comment comment={comment} />
                    <div className="w-full h-px bg-[var(--black-500)]"></div>
                  </div>
                ))}

                <div
                  ref={loaderRef}
                  className="h-20 w-full flex items-center justify-center"
                >
                  {loadingMore && hasMore && (
                    <div className="flex flex-col items-center gap-2 py-4">
                      <LoaderSkeleton size="md" />
                      <span className="text-[var(--black-300)] text-sm">
                        Chargement des commentaires...
                      </span>
                    </div>
                  )}
                </div>

                {!hasMore && comments.length > 0 && (
                  <div className="text-center py-8 border-t border-[var(--black-600)]">
                    <p className="text-[var(--black-300)] font-medium">
                      Vous avez atteint la fin
                    </p>
                    <p className="text-[var(--black-400)] text-sm mt-1">
                      Plus aucun commentaire à charger
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <Body className="text-center text-[var(--black-300)] py-8">
                Aucun commentaire pour le moment
              </Body>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}
