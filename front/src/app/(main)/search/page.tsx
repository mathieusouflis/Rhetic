"use client";

import { useState, useEffect } from "react";
import { H1, Body } from "@/components/ui/Typography";
import { useSearchParams } from "next/navigation";
import { fetchMany } from "@/lib/api/apiClient";
import { API_PATHS } from "@/lib/api/config";
import { Tabs, TabPanel } from "@/components/ui/Tabs";
import { Post } from "@/components/ui/Post";
import { Comment } from "@/components/ui/Comment";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import LoaderSkeleton from "@/components/ui/LoaderSkeleton";
import { Button } from "@/components/ui/Button";
import { PostType, CommentType } from "@/types/post";
import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { useAuth } from "@/providers/AuthProvider";
import { Community } from "@/components/ui/Community";
import { ENV, ICONS } from "@/config";

interface UserType {
  id: number;
  username: string;
  email?: string;
  bio?: string;
  documentId: string;
  followers_count?: number;
  following?: boolean;
  avatar?: any;
}

interface SubrheticType {
  id: number;
  name: string;
  description?: string;
  documentId: string;
  icon?: { url: string };
  is_private?: boolean;
  members?: any;
}

export default function Page() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const [activeTab, setActiveTab] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const [posts, setPosts] = useState<PostType[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [postsPage, setPostsPage] = useState(1);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [loadingMorePosts, setLoadingMorePosts] = useState(false);

  const [users, setUsers] = useState<UserType[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersPage, setUsersPage] = useState(1);
  const [hasMoreUsers, setHasMoreUsers] = useState(true);
  const [loadingMoreUsers, setLoadingMoreUsers] = useState(false);

  const [comments, setComments] = useState<CommentType[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsPage, setCommentsPage] = useState(1);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [loadingMoreComments, setLoadingMoreComments] = useState(false);

  const [communities, setCommunities] = useState<SubrheticType[]>([]);
  const [communitiesLoading, setCommunitiesLoading] = useState(false);
  const [communitiesPage, setCommunitiesPage] = useState(1);
  const [hasMoreCommunities, setHasMoreCommunities] = useState(true);
  const [loadingMoreCommunities, setLoadingMoreCommunities] = useState(false);

  const [error, setError] = useState("");
  const { user } = useAuth();

  const PAGE_SIZE = 10;
  const tabItems = ["Posts", "Users", "Comments", "Communities"];

  useEffect(() => {
    setPosts([]);
    setUsers([]);
    setComments([]);
    setCommunities([]);
    setPostsPage(1);
    setUsersPage(1);
    setCommentsPage(1);
    setCommunitiesPage(1);
    setHasMorePosts(true);
    setHasMoreUsers(true);
    setHasMoreComments(true);
    setHasMoreCommunities(true);

    if (query) {
      loadDataForActiveTab();
    }
  }, [query]);

  useEffect(() => {
    if (query) {
      loadDataForActiveTab();
    }
  }, [activeTab]);

  const loadDataForActiveTab = () => {
    switch (activeTab) {
      case 0:
        if (posts.length === 0) {
          searchPosts(1, false);
        }
        break;
      case 1:
        if (users.length === 0) {
          searchUsers(1, false);
        }
        break;
      case 2:
        if (comments.length === 0) {
          searchComments(1, false);
        }
        break;
      case 3:
        if (communities.length === 0) {
          searchCommunities(1, false);
        }
        break;
    }
  };

  const searchPosts = async (pageNum: number, append: boolean = true) => {
    if (!query) return;

    try {
      if (pageNum === 1) {
        setPostsLoading(true);
      } else {
        setLoadingMorePosts(true);
      }

      const response = await fetchMany<PostType>(API_PATHS.POSTS, {
        pagination: {
          page: pageNum,
          pageSize: PAGE_SIZE,
        },
        filters: {
          title: { $containsi: query },
        },
        populate: {
          author: {
            fields: ["username"],
            populate: {
              avatar: true,
            },
          },
          subrhetic: {
            fields: ["name", "documentId"],
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
          Media: true,
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
      console.error("Error searching posts:", error);
      if (!append) {
        setError(error.message || "An error occurred while searching posts");
      }
    } finally {
      setPostsLoading(false);
      setLoadingMorePosts(false);
    }
  };

  const searchUsers = async (pageNum: number, append: boolean = true) => {
    if (!query) return;

    try {
      if (pageNum === 1) {
        setUsersLoading(true);
      } else {
        setLoadingMoreUsers(true);
      }

      const response = (await fetchMany<UserType>(API_PATHS.USERS, {
        pagination: {
          page: pageNum,
          pageSize: PAGE_SIZE,
        },
        filters: {
          username: { $containsi: query },
        },
        populate: ["followers", "followings", "avatar"],
      })) as any;

      const fetchedUsers = response || [];

      if (append && pageNum > 1) {
        setUsers((prevUsers) => [...prevUsers, ...fetchedUsers]);
      } else {
        setUsers(fetchedUsers);
      }

      const totalPages = response.meta?.pagination?.pageCount || 1;
      setHasMoreUsers(pageNum < totalPages);
    } catch (error: any) {
      console.error("Error searching users:", error);
      if (!append) {
        setError(error.message || "An error occurred while searching users");
      }
    } finally {
      setUsersLoading(false);
      setLoadingMoreUsers(false);
    }
  };

  const searchComments = async (pageNum: number, append: boolean = true) => {
    if (!query) return;

    try {
      if (pageNum === 1) {
        setCommentsLoading(true);
      } else {
        setLoadingMoreComments(true);
      }

      const response = await fetchMany<CommentType>(API_PATHS.COMMENTS, {
        pagination: {
          page: pageNum,
          pageSize: PAGE_SIZE,
        },
        filters: {
          content: { $containsi: query },
        },
        populate: {
          author: {
            fields: ["username"],
            populate: "avatar",
          },
          childrens: {
            count: true,
          },
          post: {
            fields: ["title", "documentId"],
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
      setHasMoreComments(pageNum < totalPages);
    } catch (error: any) {
      console.error("Error searching comments:", error);
      if (!append) {
        setError(error.message || "An error occurred while searching comments");
      }
    } finally {
      setCommentsLoading(false);
      setLoadingMoreComments(false);
    }
  };

  const searchCommunities = async (pageNum: number, append: boolean = true) => {
    if (!query) return;

    try {
      if (pageNum === 1) {
        setCommunitiesLoading(true);
      } else {
        setLoadingMoreCommunities(true);
      }

      const response = await fetchMany<SubrheticType>(API_PATHS.SUBRHETIC, {
        pagination: {
          page: pageNum,
          pageSize: PAGE_SIZE,
        },
        filters: {
          name: { $containsi: query },
        },
        populate: ["members", "icon"],
      });

      const fetchedCommunities = response.data || [];

      if (append && pageNum > 1) {
        setCommunities((prevCommunities) => [
          ...prevCommunities,
          ...fetchedCommunities,
        ]);
      } else {
        setCommunities(fetchedCommunities);
      }

      const totalPages = response.meta?.pagination?.pageCount || 1;
      setHasMoreCommunities(pageNum < totalPages);
    } catch (error: any) {
      console.error("Error searching communities:", error);
      if (!append) {
        setError(
          error.message || "An error occurred while searching communities"
        );
      }
    } finally {
      setCommunitiesLoading(false);
      setLoadingMoreCommunities(false);
    }
  };

  const loadMorePosts = () => {
    if (loadingMorePosts || !hasMorePosts) return;
    const nextPage = postsPage + 1;
    setPostsPage(nextPage);
    searchPosts(nextPage, true);
  };

  const loadMoreUsers = () => {
    if (loadingMoreUsers || !hasMoreUsers) return;
    const nextPage = usersPage + 1;
    setUsersPage(nextPage);
    searchUsers(nextPage, true);
  };

  const loadMoreComments = () => {
    if (loadingMoreComments || !hasMoreComments) return;
    const nextPage = commentsPage + 1;
    setCommentsPage(nextPage);
    searchComments(nextPage, true);
  };

  const loadMoreCommunities = () => {
    if (loadingMoreCommunities || !hasMoreCommunities) return;
    const nextPage = communitiesPage + 1;
    setCommunitiesPage(nextPage);
    searchCommunities(nextPage, true);
  };

  const { loaderRef: postsLoaderRef } = useInfiniteScroll(
    loadMorePosts,
    hasMorePosts && activeTab === 0
  );

  const { loaderRef: usersLoaderRef } = useInfiniteScroll(
    loadMoreUsers,
    hasMoreUsers && activeTab === 1
  );

  const { loaderRef: commentsLoaderRef } = useInfiniteScroll(
    loadMoreComments,
    hasMoreComments && activeTab === 2
  );

  const { loaderRef: communitiesLoaderRef } = useInfiniteScroll(
    loadMoreCommunities,
    hasMoreCommunities && activeTab === 3
  );

  const handleRefresh = () => {
    if (refreshing) return;
    setRefreshing(true);

    switch (activeTab) {
      case 0:
        setPosts([]);
        setPostsPage(1);
        searchPosts(1, false);
        break;
      case 1:
        setUsers([]);
        setUsersPage(1);
        searchUsers(1, false);
        break;
      case 2:
        setComments([]);
        setCommentsPage(1);
        searchComments(1, false);
        break;
      case 3:
        setCommunities([]);
        setCommunitiesPage(1);
        searchCommunities(1, false);
        break;
    }

    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const renderLoading = () => {
    return (
      <div className="flex flex-col items-center gap-3 py-8">
        <LoaderSkeleton size="lg" />
        <span className="text-[var(--black-300)]">Recherche en cours...</span>
      </div>
    );
  };

  const renderEmptyState = () => {
    const emptyMessages = [
      "Aucun post trouvé pour cette recherche.",
      "Aucun utilisateur trouvé pour cette recherche.",
      "Aucun commentaire trouvé pour cette recherche.",
      "Aucune communauté trouvée pour cette recherche.",
    ];

    return (
      <Body className="text-center text-[var(--black-300)] py-8">
        {emptyMessages[activeTab]}
      </Body>
    );
  };

  const UserCard = ({ user }: { user: UserType }) => {
    return (
      <Link href={`/users/${user.id}`} className="group">
        <div className="flex items-center justify-between p-4 border border-[var(--black-500)] rounded-lg bg-[var(--black-700)]">
          <div className="flex items-center gap-4">
            <Avatar
              src={user.avatar?.url ? user.avatar?.url : ICONS.default_user}
              alt={user.username}
              size="md"
            />
            <div className="flex flex-col">
              <Body className="font-semibold group-hover:underline">
                {user.username}
              </Body>
              {user.bio && (
                <Body className="text-sm text-[var(--black-200)] line-clamp-1">
                  {user.bio}
                </Body>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <H1>Recherche</H1>
        {query && (
          <Body className="text-[var(--black-200)]">
            Résultats pour: "{query}"
          </Body>
        )}
      </div>

      {error ? (
        <Body className="text-red-500">{error}</Body>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <Tabs
              tabs={tabItems}
              activeTab={activeTab}
              onChange={setActiveTab}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              leftIcon={refreshing ? "spinner" : "refresh"}
              iconClassName={refreshing ? "animate-spin" : ""}
            >
              {refreshing ? "Actualisation..." : "Actualiser"}
            </Button>
          </div>

          <TabPanel value={activeTab} index={0}>
            {postsLoading ? (
              renderLoading()
            ) : posts.length === 0 ? (
              renderEmptyState()
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
              </>
            )}
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            {usersLoading ? (
              renderLoading()
            ) : users.length === 0 ? (
              renderEmptyState()
            ) : (
              <div className="flex flex-col gap-4">
                {users.map((user) => (
                  <UserCard key={user.documentId || user.id} user={user} />
                ))}

                <div
                  ref={usersLoaderRef}
                  className="h-20 w-full flex items-center justify-center"
                >
                  {loadingMoreUsers && hasMoreUsers && (
                    <div className="flex flex-col items-center gap-2 py-4">
                      <LoaderSkeleton size="md" />
                      <span className="text-[var(--black-300)] text-sm">
                        Chargement des utilisateurs...
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            {commentsLoading ? (
              renderLoading()
            ) : comments.length === 0 ? (
              renderEmptyState()
            ) : (
              <>
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
              </>
            )}
          </TabPanel>

          <TabPanel value={activeTab} index={3}>
            {communitiesLoading ? (
              renderLoading()
            ) : communities.length === 0 ? (
              renderEmptyState()
            ) : (
              <div className="flex flex-col gap-4">
                {communities.map((community) => (
                  <Community
                    id={community.id}
                    key={community.id}
                    iconUrl={community.icon?.url || null}
                    name={community.name}
                    desciption={community.description}
                    membersCount={community.members.length}
                    variant="developed"
                  />
                ))}

                <div
                  ref={communitiesLoaderRef}
                  className="h-20 w-full flex items-center justify-center"
                >
                  {loadingMoreCommunities && hasMoreCommunities && (
                    <div className="flex flex-col items-center gap-2 py-4">
                      <LoaderSkeleton size="md" />
                      <span className="text-[var(--black-300)] text-sm">
                        Chargement des communautés...
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </TabPanel>
        </div>
      )}
    </div>
  );
}
