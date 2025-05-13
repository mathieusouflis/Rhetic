"use client";

import { ActionButton } from "@/components/ui/ActionButton";
import { Avatar } from "@/components/ui/Avatar";
import { Post } from "@/components/ui/Post";
import PostWriter from "@/components/ui/PostWriter";
import { Body, H1 } from "@/components/ui/Typography";
import {
  fetchOne,
  fetchMany,
  followUser,
  unfollowUser,
} from "@/lib/api/apiClient";
import { API_PATHS } from "@/lib/api/config";
import { useAuth } from "@/providers/AuthProvider";
import { PostType } from "@/types/post";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Subrhetic as BaseSubrhetic } from "../../explore/page";
import { formatNumber } from "@/lib/utils/format";
import { ENV, ICONS } from "@/config";
import { Modal } from "@/components/ui/Modal";
import { Tabs, TabPanel } from "@/components/ui/Tabs";
import { Comment } from "@/components/ui/Comment";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { Button } from "@/components/ui/Button";
import LoaderSkeleton from "@/components/ui/LoaderSkeleton";
import { toastUtils } from "@/lib/utils/toast";

interface Subrhetic extends BaseSubrhetic {
  posts?: PostType[];
  comments?: any[];
  username?: string;
  bio?: string;
  avatar?: {
    url: string;
  };
  followers?: {
    count: number;
    length?: number;
  };
}

export default function Page() {
  const { userId }: { userId: string } = useParams();
  const [userProfile, setUserProfile] = useState<Subrhetic | null>(null);
  const [followed, setFollowed] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const router = useRouter();

  const [posts, setPosts] = useState<PostType[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [postsPage, setPostsPage] = useState(1);
  const [commentsPage, setCommentsPage] = useState(1);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMorePosts, setLoadingMorePosts] = useState(false);
  const [loadingMoreComments, setLoadingMoreComments] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const PAGE_SIZE = 10;

  const { user } = useAuth();

  const handleBack = async () => {
    router.back();
  };

  const loadUserProfile = async (isRefreshing = false) => {
    try {
      if (isRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const toastId = isRefreshing
        ? toastUtils.loading("Actualisation du profil...")
        : undefined;

      const response = await fetchOne<any>(API_PATHS.USERS, userId, {
        fields: ["id", "documentId", "username", "bio"],
        populate: {
          avatar: true,
          followers: {
            count: true,
            filters: user
              ? {
                  follower: {
                    id: {
                      $eq: user.id,
                    },
                  },
                }
              : undefined,
          },
        },
      });

      setUserProfile(response);
      setFollowed(response.followers?.length > 0);

      await Promise.all([loadMorePosts(1, false), loadMoreComments(1, false)]);

      if (toastId) {
        toastUtils.success("Profil actualisé", toastId);
      }
    } catch (error: any) {
      console.error("Error fetching profile:", error);
      setError(
        error.message || "Une erreur est survenue lors du chargement du profil"
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
        setLoadingMorePosts(true);
      }

      const response = await fetchMany<PostType>(API_PATHS.POSTS, {
        sort: ["createdAt:desc"],
        pagination: {
          page: pageNum,
          pageSize: PAGE_SIZE,
        },
        filters: {
          author: {
            id: {
              $eq: userId,
            },
          },
        },
        populate: {
          Media: true,
          author: {
            fields: ["username"],
            populate: {
              avatar: true,
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
      setHasMorePosts(pageNum < totalPages);
    } catch (error: any) {
      console.error("Error fetching posts:", error);
      if (pageNum === 1 && !append) {
        setError(
          (error.message || "Une erreur est survenue") + " (publications)"
        );
      }
    } finally {
      setLoadingMorePosts(false);
    }
  };

  const loadMoreComments = async (pageNum: number, append: boolean = true) => {
    try {
      if (pageNum > 1) {
        setLoadingMoreComments(true);
      }

      const response = await fetchMany<any>(API_PATHS.COMMENTS, {
        sort: ["createdAt:desc"],
        pagination: {
          page: pageNum,
          pageSize: PAGE_SIZE,
        },
        filters: {
          author: {
            id: {
              $eq: userId,
            },
          },
        },
        populate: {
          author: {
            fields: ["username", "id"],
            populate: {
              avatar: true,
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
          post: {
            fields: ["id", "title", "documentId"],
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
      setHasMoreComments(pageNum < totalPages);
    } catch (error: any) {
      console.error("Error fetching comments:", error);
      if (pageNum === 1 && !append) {
        setError(
          (error.message || "Une erreur est survenue") + " (commentaires)"
        );
      }
    } finally {
      setLoadingMoreComments(false);
    }
  };

  const refreshProfile = async () => {
    if (refreshing) return;

    if (error) {
      setError("");
    }

    setPostsPage(1);
    setCommentsPage(1);
    await loadUserProfile(true);
  };

  const loadMorePostsOnScroll = () => {
    if (loadingMorePosts || !hasMorePosts) return;
    const nextPage = postsPage + 1;
    setPostsPage(nextPage);
    loadMorePosts(nextPage, true);
  };

  const loadMoreCommentsOnScroll = () => {
    if (loadingMoreComments || !hasMoreComments) return;
    const nextPage = commentsPage + 1;
    setCommentsPage(nextPage);
    loadMoreComments(nextPage, true);
  };

  useEffect(() => {
    if (activeTab === 0 && posts.length === 0 && !loading) {
      loadMorePosts(1, false);
    } else if (activeTab === 1 && comments.length === 0 && !loading) {
      loadMoreComments(1, false);
    }
  }, [activeTab]);

  const { loaderRef: postsLoaderRef } = useInfiniteScroll(
    loadMorePostsOnScroll,
    hasMorePosts && activeTab === 0
  );

  const { loaderRef: commentsLoaderRef } = useInfiniteScroll(
    loadMoreCommentsOnScroll,
    hasMoreComments && activeTab === 1
  );

  useEffect(() => {
    loadUserProfile();
  }, [userId]);

  const handleSubrheticJoin = async () => {
    try {
      if (!user) {
        router.push("/login");
        return;
      }

      const toastId = toastUtils.loading(
        followed ? "Désabonnement en cours..." : "Abonnement en cours..."
      );

      if (followed) {
        await unfollowUser(userId);
        setFollowed(false);
        toastUtils.success("Vous vous êtes désabonné", toastId);
      } else {
        await followUser(userId);
        setFollowed(true);
        toastUtils.success("Vous vous êtes abonné", toastId);
      }

      await loadUserProfile(false);
    } catch (error: any) {
      console.error("Error following/unfollowing user:", error);
      toastUtils.error(
        error.message ||
          (followed
            ? "Erreur lors du désabonnement"
            : "Erreur lors de l'abonnement")
      );
    }
  };

  const tabItems = ["Posts", "Comments"];

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
                onClick={refreshProfile}
                leftIcon="refresh"
              >
                Réessayer
              </Button>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-row gap-4">
        <Avatar
          size="xl"
          src={
            userProfile?.avatar?.url
              ? userProfile?.avatar?.url
              : ICONS.default_rhetic
          }
          alt="subIcon"
        />
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-row justify-between w-full">
            <div className="flex flex-col gap-1.5">
              <H1>{userProfile && userProfile.username}</H1>
              <Body className="text-[var(--black-300)]">
                {formatNumber(userProfile?.followers?.count || 0)} followers
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
                  <PostWriter
                    isSubrheticRequired={false}
                    isTitleRequired={false}
                    className="w-3xl"
                  />
                </Modal.Content>
              </Modal>

              {user && user.id?.toString() !== userId && (
                <ActionButton
                  variant={followed ? "gray2" : "white"}
                  leftIcon={false}
                  className="h-fit group relative"
                  onClick={handleSubrheticJoin}
                >
                  <span className="font-semibold group-hover:hidden">
                    {followed ? "Following" : "Follow"}
                  </span>
                  <span className="font-semibold hidden group-hover:inline">
                    {followed ? "Unfollow" : "Follow"}
                  </span>
                </ActionButton>
              )}
            </div>
          </div>
          <Body className="w-full"> {userProfile?.bio} </Body>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <Tabs tabs={tabItems} activeTab={activeTab} onChange={setActiveTab} />
        <Button
          variant="ghost"
          size="sm"
          onClick={refreshProfile}
          disabled={refreshing}
          leftIcon={refreshing ? "spinner" : "refresh"}
          iconClassName={refreshing ? "animate-spin" : ""}
        >
          {refreshing ? "Actualisation..." : "Actualiser"}
        </Button>
      </div>

      <TabPanel value={activeTab} index={0}>
        {loading && posts.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-8">
            <LoaderSkeleton size="lg" />
            <span className="text-[var(--black-300)]">
              Chargement des publications...
            </span>
          </div>
        ) : posts.length === 0 ? (
          <Body className="text-center text-[var(--black-300)] py-8">
            Aucune publication trouvée
          </Body>
        ) : (
          <>
            {posts.map((post: PostType) => (
              <div
                key={post.documentId || post.id}
                className="flex flex-col gap-2"
              >
                <Post post={post} />
                <div className="w-full h-px bg-[var(--black-500)]"></div>
              </div>
            ))}

            <div
              ref={postsLoaderRef}
              className="h-20 w-full flex items-center justify-center"
            >
              {loadingMorePosts && hasMorePosts && (
                <div className="flex flex-col items-center gap-2 py-4">
                  <LoaderSkeleton size="md" />
                  <span className="text-[var(--black-300)] text-sm">
                    Chargement des publications...
                  </span>
                </div>
              )}
            </div>

            {!hasMorePosts && posts.length > 0 && (
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
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        {loading && comments.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-8">
            <LoaderSkeleton size="lg" />
            <span className="text-[var(--black-300)]">
              Chargement des commentaires...
            </span>
          </div>
        ) : comments.length === 0 ? (
          <Body className="text-center text-[var(--black-300)] py-8">
            Aucun commentaire trouvé
          </Body>
        ) : (
          <>
            {comments.map((comment: any) => (
              <div
                key={comment.documentId || comment.id}
                className="flex flex-col gap-2 mb-4"
              >
                <Comment comment={comment} />
                <div className="w-full h-px bg-[var(--black-500)]"></div>
              </div>
            ))}

            <div
              ref={commentsLoaderRef}
              className="h-20 w-full flex items-center justify-center"
            >
              {loadingMoreComments && hasMoreComments && (
                <div className="flex flex-col items-center gap-2 py-4">
                  <LoaderSkeleton size="md" />
                  <span className="text-[var(--black-300)] text-sm">
                    Chargement des commentaires...
                  </span>
                </div>
              )}
            </div>

            {!hasMoreComments && comments.length > 0 && (
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
      </TabPanel>
    </div>
  );
}
