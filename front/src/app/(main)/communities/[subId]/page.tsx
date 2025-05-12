"use client";

import { ActionButton } from "@/components/ui/ActionButton";
import { Avatar } from "@/components/ui/Avatar";
import { Post } from "@/components/ui/Post";
import PostWriter from "@/components/ui/PostWriter";
import { Body, H1 } from "@/components/ui/Typography";
import {
  fetchOne,
  fetchMany,
  joinCommunity,
  leaveCommunity,
} from "@/lib/api/apiClient";
import { API_PATHS } from "@/lib/api/config";
import { useAuth } from "@/providers/AuthProvider";
import { PostType } from "@/types/post";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Subrhetic as BaseSubrhetic } from "../../explore/page";
import { formatNumber } from "@/lib/utils/format";
import { ICONS } from "@/config";
import { Separator } from "@/components/ui/Separator";
import { Modal } from "@/components/ui/Modal";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { Button } from "@/components/ui/Button";
import LoaderSkeleton from "@/components/ui/LoaderSkeleton";
import { toastUtils } from "@/lib/utils/toast";

interface Subrhetic extends BaseSubrhetic {
  posts?: PostType[];
}

export default function Page() {
  const { subId }: { subId: string } = useParams();
  const [sub, setSub] = useState<Subrhetic | null>(null);
  const [userJoined, setUserJoined] = useState(false);
  const router = useRouter();
  const [posts, setPosts] = useState<PostType[]>([]);
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

  const loadCommunity = async (isRefreshing = false) => {
    try {
      if (isRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const toastId = isRefreshing
        ? toastUtils.loading("Actualisation de la communauté...")
        : undefined;

      const queryOptions = {
        fields: ["id", "documentId", "name", "description"],
        populate: {
          icon: true,
          members: {
            filters: {
              id: {
                $eq: user.id,
              },
            },
            fields: ["id"],
          },
        },
      };

      const response = (await fetchOne<Subrhetic>(
        API_PATHS.SUBRHETIC,
        subId,
        queryOptions
      )) as any;

      setSub(response.data);

      setUserJoined(
        Array.isArray(response.data.members) && response.data.members.length > 0
      );

      await loadMorePosts(1, false);

      if (toastId) {
        toastUtils.success("Communauté actualisée", toastId);
      }
    } catch (error: any) {
      console.error("Error fetching community:", error);
      setError(
        error.message ||
          "Une erreur est survenue lors du chargement de la communauté"
      );
      if (refreshing) {
        toastUtils.error("Échec de l'actualisation");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadMorePosts = async (pageNum: number, append: boolean = true) => {
    try {
      if (pageNum > 1) {
        setLoadingMore(true);
      }

      const response = await fetchMany<PostType>(API_PATHS.POSTS, {
        sort: ["createdAt:desc"],
        pagination: {
          page: pageNum,
          pageSize: PAGE_SIZE,
        },
        filters: {
          subrhetic: {
            documentId: {
              $eq: subId,
            },
          },
        },
        populate: {
          Media: true,
          author: {
            fields: ["username"],
          },
          votes: user
            ? {
                fields: ["type"],
                filters: {
                  user: {
                    id: {
                      $eq: user.id,
                    },
                  },
                },
              }
            : undefined,
          saved_items: user
            ? {
                filters: {
                  users_permissions_user: {
                    id: {
                      $eq: user.id,
                    },
                  },
                },
              }
            : undefined,
          comments: {
            count: true,
          },
        },
      });

      const fetchedPosts = response.data || [];

      if (append && pageNum > 1) {
        setPosts((prevPosts) => [...prevPosts, ...fetchedPosts]);
      } else {
        setPosts(fetchedPosts);
      }

      const totalPages = response.meta?.pagination?.pageCount || 1;
      setHasMore(pageNum < totalPages);
    } catch (error: any) {
      console.error("Error fetching posts:", error);
      if (pageNum === 1) {
        setError(
          error.message ||
            "Une erreur est survenue lors du chargement des publications"
        );
      }
    } finally {
      setLoadingMore(false);
    }
  };

  const refreshCommunity = async () => {
    if (refreshing) return;

    if (error) {
      setError("");
    }

    setPage(1);
    await loadCommunity(true);
  };

  const loadMore = () => {
    if (loadingMore || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    loadMorePosts(nextPage, true);
  };

  const { loaderRef } = useInfiniteScroll(loadMore, hasMore);

  const [isUserInitialized, setIsUserInitialized] = useState(false);

  useEffect(() => {
    if (user !== undefined && user?.id) {
      setIsUserInitialized(true);
    }
  }, [user]);

  useEffect(() => {
    if (subId && isUserInitialized) {
      loadCommunity();
    }
  }, [subId, isUserInitialized]);

  const handleSubrheticJoin = async () => {
    try {
      if (!user) {
        router.push("/login");
        return;
      }

      const toastId = toastUtils.loading(
        userJoined ? "Désinscription en cours..." : "Inscription en cours..."
      );

      const communityId = sub?.documentId || subId;

      if (userJoined) {
        await leaveCommunity(sub?.id);
        setUserJoined(false);
        toastUtils.success("Vous avez quitté la communauté", toastId);
      } else {
        await joinCommunity(sub?.id);
        setUserJoined(true);
        toastUtils.success("Vous avez rejoint la communauté", toastId);
      }

      await loadCommunity(false);
    } catch (error: any) {
      console.error("Error joining/leaving community:", error);
      toastUtils.error(
        error.message ||
          (userJoined
            ? "Erreur lors de la désinscription"
            : "Erreur lors de l'inscription")
      );
    }
  };

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
      <div className="flex flex-row gap-4">
        <Avatar
          size="xl"
          src={
            sub?.icon?.url
              ? "http://localhost:1337" + sub?.icon?.url
              : ICONS.default_rhetic
          }
          alt="subIcon"
        />
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-row justify-between w-full">
            <div className="flex flex-col gap-1.5">
              <H1>{sub && sub.name}</H1>
              <Body className="text-[var(--black-300)]">
                {formatNumber(sub?.members?.count || 0)} members
              </Body>
            </div>
            <div className="flex flex-row gap-1.5">
              <Modal>
                <Modal.Trigger asChild>
                  <ActionButton
                    variant="gray2"
                    className="h-fit"
                    leftIconName="plus"
                  >
                    <span className="font-semibold">Post</span>
                  </ActionButton>
                </Modal.Trigger>
                <Modal.Content className="w-3xl">
                  <PostWriter className="w-3xl" />
                </Modal.Content>
              </Modal>

              <ActionButton
                variant={userJoined ? "gray2" : "white"}
                leftIcon={false}
                className="h-fit group relative"
                onClick={handleSubrheticJoin}
              >
                <span className="font-semibold group-hover:hidden">
                  {userJoined ? "Joined" : "Join"}
                </span>
                <span className="font-semibold hidden group-hover:inline">
                  {userJoined ? "Leave" : "Join"}
                </span>
              </ActionButton>
            </div>
          </div>
          <Body className="w-full"> {sub?.description} </Body>
        </div>
      </div>
      <Separator direction="width" />
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Publications</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={refreshCommunity}
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
                  onClick={() => refreshCommunity()}
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
    </div>
  );
}
