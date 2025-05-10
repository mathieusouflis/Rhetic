"use client";

import { ActionButton } from "@/components/ui/ActionButton";
import { Avatar } from "@/components/ui/Avatar";
import { Post } from "@/components/ui/Post";
import PostWriter from "@/components/ui/PostWriter";
import { Body, H1 } from "@/components/ui/Typography";
import { fetchOne } from "@/lib/api/apiClient";
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

interface Subrhetic extends BaseSubrhetic {
  posts?: PostType[];
}

export default function Page() {
  const { subId }: { subId: string } = useParams();
  const [sub, setSub] = useState<Subrhetic | null>(null);
  const router = useRouter();

  const { user } = useAuth();

  const handleBack = async () => {
    router.back();
  };

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const response = (await fetchOne<Subrhetic>(
          API_PATHS.SUBRHETIC,
          subId,
          {
            fields: ["id", "documentId", "name", "description"],
            populate: {
              icon: true,
              members: {
                filter: {
                  id: user?.id,
                },
                fields: ["id"],
              },
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
            },
          }
        )) as any;

        setSub(response.data);
      } catch (error) {
        console.error("Error fetching sub:", error);
      }
    };

    fetchPostAndComments();
  }, [subId]);

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

              <ActionButton variant="white" leftIcon={false} className="h-fit">
                <span className="font-semibold">Join</span>
              </ActionButton>
            </div>
          </div>
          <Body className="w-full"> {sub?.description} </Body>
        </div>
      </div>
      <Separator direction="width" />
      {sub?.posts && sub.posts.length > 0 ? (
        sub.posts.map((post: PostType) => (
          <div key={post.documentId || post.id} className="flex flex-col gap-2">
            <Post post={post} />
            <div className="w-full h-px bg-[var(--black-500)]"></div>
          </div>
        ))
      ) : (
        <Body className="text-center text-[var(--black-300)]">
          No posts yet
        </Body>
      )}
    </div>
  );
}
