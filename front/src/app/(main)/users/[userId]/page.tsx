"use client";

import { ActionButton } from "@/components/ui/ActionButton";
import { Avatar } from "@/components/ui/Avatar";
import { Post } from "@/components/ui/Post";
import PostWriter from "@/components/ui/PostWriter";
import { Body, H1 } from "@/components/ui/Typography";
import { fetchOne, remove } from "@/lib/api/apiClient";
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
import { Tabs, TabPanel } from "@/components/ui/Tabs";
import { Comment } from "@/components/ui/Comment";

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

  const { user } = useAuth();

  const handleBack = async () => {
    router.back();
  };

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const response = (await fetchOne<any>(API_PATHS.USERS, userId, {
          fields: ["id", "documentId", "username", "bio"],
          populate: {
            avatar: true,
            // followers: {
            //   count: true,
            // },
            posts: {
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
                  count: true,
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
        })) as any;

        setUserProfile(response);
        console.log(response);

        const followedResponse = await fetchOne<any>(API_PATHS.USERS, userId, {
          fields: ["id", "documentId", "username", "bio"],
          populate: {
            followers: {
              filters: {
                id: {
                  $eq: user?.id,
                },
              },
            },
          },
        });
        setFollowed((followedResponse as any).data.followers?.length > 0);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchPostAndComments();
  }, [userId]);

  const handleSubrheticJoin = async () => {
    if (followed) {
      // remove(
      //   API_PATHS.SUBRHETIC + "/" + userId + "/members",
      //   user?.id as string
      // );
    }
  };

  // Définition des onglets
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
      <div className="flex flex-row gap-4">
        <Avatar
          size="xl"
          src={
            userProfile?.avatar?.url
              ? "http://localhost:1337" + userProfile?.avatar?.url
              : ICONS.default_rhetic
          }
          alt="subIcon"
        />
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-row justify-between w-full">
            <div className="flex flex-col gap-1.5">
              <H1>{userProfile && userProfile.username}</H1>
              <Body className="text-[var(--black-300)]">
                {formatNumber(userProfile?.followers?.count || 0)} members
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

              <ActionButton
                variant={followed ? "gray2" : "white"}
                leftIcon={false}
                className="h-fit"
                onClick={handleSubrheticJoin}
              >
                <span className="font-semibold">
                  {followed ? "Following" : "Follow"}
                </span>
              </ActionButton>
            </div>
          </div>
          <Body className="w-full"> {userProfile?.bio} </Body>
        </div>
      </div>

      <Tabs tabs={tabItems} activeTab={activeTab} onChange={setActiveTab} />

      <TabPanel value={activeTab} index={0}>
        {userProfile?.posts && userProfile.posts.length > 0 ? (
          userProfile.posts.map((post: PostType) => (
            <div
              key={post.documentId || post.id}
              className="flex flex-col gap-2"
            >
              <Post post={post} />
              <div className="w-full h-px bg-[var(--black-500)]"></div>
            </div>
          ))
        ) : (
          <Body className="text-center text-[var(--black-300)]">
            No posts yet
          </Body>
        )}
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        {userProfile?.comments && userProfile.comments.length > 0 ? (
          userProfile.comments.map((comment: any) => (
            <Comment comment={comment} key={comment.documentId || comment.id} />
          ))
        ) : (
          <Body className="text-center text-[var(--black-300)]">
            No comments yet
          </Body>
        )}
      </TabPanel>
    </div>
  );
}
