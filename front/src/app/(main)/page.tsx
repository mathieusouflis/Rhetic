"use client";
import { DropdownSelect } from "@/components/ui/Dropdown";
import PostWriter from "@/components/ui/PostWriter";
import { useEffect, useState } from "react";
import { Post } from "@/components/ui/Post";
import { PostType } from "@/types/post";
import { fetchMany } from "@/lib/api/apiClient";
import { API_PATHS } from "@/lib/api/config";
import { useAuth } from "@/providers/AuthProvider";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import LoaderSkeleton from "@/components/ui/LoaderSkeleton";
import { Button } from "@/components/ui/Button";
import { useApiError } from "@/hooks/useApiError";
import toast from "react-hot-toast";

export default function Home() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [sortOption, setSortOption] = useState<"new" | "popular">("new");
  const [refreshing, setRefreshing] = useState(false);
  const PAGE_SIZE = 10;

  const { user } = useAuth();
  const { error, setError } = useApiError();

  const loadPosts = async (
    pageNum: number,
    append: boolean = false,
    isRefreshing: boolean = false
  ) => {
    try {
      if (pageNum === 1) {
        if (isRefreshing) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }
      } else {
        setLoadingMore(true);
      }

      let sortQuery;
      switch (sortOption) {
        case "new":
          sortQuery = ["createdAt:desc"];
          break;
        case "popular":
          sortQuery = ["upvotes:desc", "createdAt:desc"];
          break;
        default:
          sortQuery = ["createdAt:desc"];
      }

      const toastId = isRefreshing
        ? toast.loading("Actualisation des publications...")
        : undefined;

      const response = await fetchMany<PostType>(API_PATHS.POSTS, {
        pagination: {
          page: pageNum,
          pageSize: PAGE_SIZE,
        },
        sort: sortQuery,
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
          subrhetic: {
            fields: ["name", "documentId"],
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
            count: true,
          },
        },
      });

      if (append) {
        setPosts((prevPosts) => [...prevPosts, ...response.data]);
      } else {
        setPosts(response.data);
      }

      const pagination = response.meta?.pagination;
      if (pagination) {
        setHasMore(pagination.page < pagination.pageCount);
      } else {
        setHasMore(false);
      }

      if (toastId) {
        toast.success("Publications actualisées", { id: toastId });
      }
    } catch (error: any) {
      console.error("Error fetching posts:", error);
      setError(
        error.message ||
          "Une erreur est survenue lors du chargement des publications"
      );

      if (isRefreshing) {
        toast.error("Échec de l'actualisation");
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadPosts(1);
  }, [sortOption]);

  const loadMore = () => {
    if (loadingMore || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    loadPosts(nextPage, true);
  };

  const refreshPosts = async () => {
    if (refreshing) return;

    if (error) {
      setError("");
    }

    setPage(1);
    await loadPosts(1, false, true);
  };

  const { loaderRef } = useInfiniteScroll(loadMore, hasMore);

  return (
    <>
      <div className="flex flex-col gap-2.5">
        <PostWriter isSubrheticRequired={false} isTitleRequired={false} />
        <div className="w-full h-px bg-[var(--black-400)]"></div>

        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row gap-2.5">
            <DropdownSelect
              options={[
                { label: "Pour vous", value: "for_you" },
                { label: "Tous", value: "all" },
              ]}
              placeholder="Pour vous"
              onChange={(value) => console.log("View change:", value)}
            />
            <DropdownSelect
              options={[
                { label: "Les plus récents", value: "new" },
                { label: "Les plus populaires", value: "popular" },
              ]}
              placeholder={
                sortOption === "new"
                  ? "Les plus récents"
                  : "Les plus populaires"
              }
              onChange={(value) => {
                if (value === "new" || value === "popular") {
                  setSortOption(value);
                }
              }}
            />
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={refreshPosts}
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
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => refreshPosts()}
                  leftIcon="refresh"
                >
                  Réessayer
                </Button>
              </div>
            </div>
          </div>
        )}

        {loading && posts.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-8">
            <LoaderSkeleton size="lg" />
            <span className="text-[var(--black-300)]">
              Chargement des publications...
            </span>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-8 text-[var(--black-300)]">
            Aucune publication trouvée
          </div>
        ) : (
          <>
            {posts.map((post) => (
              <div
                key={post.documentId || post.id}
                className="flex flex-col gap-2"
              >
                <Post post={post} />
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
                    Chargement des publications...
                  </span>
                </div>
              )}
            </div>

            {!hasMore && posts.length > 0 && (
              <div className="text-center py-8 border-t border-[var(--black-600)]">
                <p className="text-[var(--black-300)] font-medium">
                  Vous avez atteint la fin
                </p>
                <p className="text-[var(--black-400)] text-sm mt-1">
                  Plus aucune publication à charger
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
