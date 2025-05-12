"use client";

import { ActionButton } from "@/components/ui/ActionButton";
import { Comment } from "@/components/ui/Comment";
import PostWriter from "@/components/ui/PostWriter";
import { Body } from "@/components/ui/Typography";
import { fetchOne, fetchMany } from "@/lib/api/apiClient";
import { API_PATHS } from "@/lib/api/config";
import { useAuth } from "@/providers/AuthProvider";
import { CommentType } from "@/types/post";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { Button } from "@/components/ui/Button";
import LoaderSkeleton from "@/components/ui/LoaderSkeleton";
import { toastUtils } from "@/lib/utils/toast";

export default function Page() {
  const { commentId }: { commentId: string } = useParams();
  const [comment, setComment] = useState<CommentType>();
  const router = useRouter();
  const [childComments, setChildComments] = useState<CommentType[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const PAGE_SIZE = 10;

  const { user } = useAuth();

  const handleBack = async () => {
    router.back();
  };

  useEffect(() => {
    fetchPostAndComments();
  }, [commentId]);

  const fetchPostAndComments = async (isRefreshing = false) => {
    try {
      if (isRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const toastId = isRefreshing
        ? toastUtils.loading("Actualisation des commentaires...")
        : undefined;

      const response = await fetchOne<CommentType>(
        API_PATHS.COMMENTS,
        commentId,
        {
          populate: {
            childrens: true,
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
          },
        }
      );

      setComment(response.data);

      await loadMoreChildComments(1, false);

      if (toastId) {
        toastUtils.success("Commentaires actualisés", toastId);
      }
    } catch (error: any) {
      console.error("Error fetching comment:", error);
      setError(
        error.message ||
          "Une erreur est survenue lors du chargement des commentaires"
      );
      if (refreshing) {
        toastUtils.error("Échec de l'actualisation");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadMoreChildComments = async (
    pageNum: number,
    append: boolean = true
  ) => {
    try {
      if (pageNum > 1) {
        setLoadingMore(true);
      }

      const response = await fetchMany<CommentType>(API_PATHS.COMMENTS, {
        pagination: {
          page: pageNum,
          pageSize: PAGE_SIZE,
        },
        filters: {
          parent: {
            documentId: {
              $eq: commentId,
            },
          },
        },
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
          childrens: true,
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
        setChildComments((prevComments) => [
          ...prevComments,
          ...fetchedComments,
        ]);
      } else {
        setChildComments(fetchedComments);
      }

      const totalPages = response.meta?.pagination?.pageCount || 1;
      setHasMore(pageNum < totalPages);
    } catch (error: any) {
      console.error("Error fetching child comments:", error);
      if (pageNum === 1) {
        setError(
          error.message ||
            "Une erreur est survenue lors du chargement des commentaires"
        );
      }
    } finally {
      setLoadingMore(false);
    }
  };

  const refreshComments = async () => {
    if (refreshing) return;

    if (error) {
      setError("");
    }

    setPage(1);
    await fetchPostAndComments(true);
  };

  const loadMore = () => {
    if (loadingMore || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    loadMoreChildComments(nextPage, true);
  };

  const { loaderRef } = useInfiniteScroll(loadMore, hasMore);

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

      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Commentaires</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={refreshComments}
            disabled={refreshing}
            leftIcon={refreshing ? "spinner" : "refresh"}
            iconClassName={refreshing ? "animate-spin" : ""}
          >
            {refreshing ? "Actualisation..." : "Actualiser"}
          </Button>
        </div>

        {error && (
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
                  onClick={() => refreshComments()}
                  leftIcon="refresh"
                >
                  Réessayer
                </Button>
              </div>
            </div>
          </div>
        )}

        {loading && childComments.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-8">
            <LoaderSkeleton size="lg" />
            <span className="text-[var(--black-300)]">
              Chargement des commentaires...
            </span>
          </div>
        ) : childComments.length === 0 ? (
          <Body className="text-center text-[var(--black-300)]">
            Aucun commentaire pour le moment
          </Body>
        ) : (
          <>
            {childComments.map((children) => (
              <div
                key={children.documentId || children.id}
                className="flex flex-col gap-2"
              >
                <Comment comment={children} />
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

            {!hasMore && childComments.length > 0 && (
              <div className="text-center py-8 border-t border-[var(--black-600)]">
                <p className="text-[var(--black-300)] font-medium">
                  Vous avez atteint la fin
                </p>
                <p className="text-[var(--black-400)] text-sm mt-1">
                  Plus aucun commentaire à charger
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
