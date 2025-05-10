"use client";

import { ActionButton } from "@/components/ui/ActionButton";
import { Community } from "@/components/ui/Community";
import { CreateCommunityModal } from "@/components/ui/CreateCommunityModal";
import { Separator } from "@/components/ui/Separator";
import { TinyButton } from "@/components/ui/TinyButton";
import { Body, H1, H2 } from "@/components/ui/Typography";
import { ICONS } from "@/config";
import { fetchMany } from "@/lib/api/apiClient";
import { useState, useEffect } from "react";

export interface Subrhetic {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  members: any;
  icon?: {
    url: string;
  };
}

interface Topic {
  id: number;
  documentId: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  subrhetics: Subrhetic[];
}

interface TopicCategory {
  id: number;
  documentId: string;
  Name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  topics: Topic[];
}

// Interface pour suivre les communautés supplémentaires par topic
interface TopicCommunitiesState {
  [topicId: number]: {
    displayedInitial: number; // Nombre de communautés affichées initialement
    extraCommunities: Subrhetic[]; // Communautés supplémentaires chargées
    page: number;
    hasMore: boolean;
    isLoading: boolean;
  };
}

const PAGE_SIZE = 4;

export default function Page() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [categories, setCategories] = useState<TopicCategory[]>([]);
  const [topicCommunitiesState, setTopicCommunitiesState] =
    useState<TopicCommunitiesState>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTopicCategories = async () => {
      try {
        setIsLoading(true);
        const response = await fetchMany<TopicCategory>("/topic-categories", {
          populate: {
            topics: {
              populate: {
                subrhetics: {
                  fields: ["id", "name"],
                  populate: {
                    icon: { fields: ["url"] },
                    members: { count: true },
                  },
                },
              },
            },
          },
        });

        if (response.data) {
          setCategories(response.data);

          const initialState: TopicCommunitiesState = {};
          response.data.forEach((category) => {
            category.topics.forEach((topic) => {
              const initialCommunities = topic.subrhetics || [];

              initialState[topic.id] = {
                displayedInitial: Math.min(
                  initialCommunities.length,
                  PAGE_SIZE
                ),
                extraCommunities: [],
                page: 2,
                hasMore: initialCommunities.length >= PAGE_SIZE,
                isLoading: false,
              };
            });
          });

          setTopicCommunitiesState(initialState);
        }
      } catch (error) {
        console.error("Error fetching topic categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopicCategories();
  }, [refreshKey]);

  const handleLoadMore = async (topicId: number) => {
    if (
      !topicCommunitiesState[topicId] ||
      topicCommunitiesState[topicId].isLoading ||
      !topicCommunitiesState[topicId].hasMore
    ) {
      return;
    }

    try {
      setTopicCommunitiesState((prev) => ({
        ...prev,
        [topicId]: { ...prev[topicId], isLoading: true },
      }));

      const currentPage = topicCommunitiesState[topicId].page;

      try {
        const response = await fetchMany<Subrhetic>("/subrhetics", {
          filters: {
            topics: {
              id: {
                $eq: topicId,
              },
            },
          },
          populate: {
            icon: { fields: ["url"] },
            members: {
              count: true,
            },
          },

          pagination: {
            page: currentPage,
            pageSize: PAGE_SIZE,
          },
        });

        if (!response.data) {
          throw new Error("No data returned from the API");
        } else {
          const newCommunities = response.data;
          const hasMorePages = newCommunities.length === PAGE_SIZE;

          setTopicCommunitiesState((prev) => ({
            ...prev,
            [topicId]: {
              ...prev[topicId],
              extraCommunities: [
                ...(prev[topicId].extraCommunities || []),
                ...newCommunities,
              ],
              page: currentPage + 1,
              hasMore: hasMorePages,
              isLoading: false,
            },
          }));
        }
      } catch (error) {
        console.error(
          `Error fetching communities for topic ${topicId}:`,
          error
        );
        setTopicCommunitiesState((prev) => ({
          ...prev,
          [topicId]: { ...prev[topicId], isLoading: false },
        }));
        return;
      }
    } catch (error) {
      console.error(
        `Error fetching more communities for topic ${topicId}:`,
        error
      );
      setTopicCommunitiesState((prev) => ({
        ...prev,
        [topicId]: { ...prev[topicId], isLoading: false },
      }));
    }
  };

  const getFilteredCategories = () => {
    if (selectedCategory === null) {
      return categories;
    } else {
      return categories.filter(
        (category) => category.Name === selectedCategory
      );
    }
  };

  const getCommunitiesToDisplay = (topic: Topic) => {
    const topicState = topicCommunitiesState[topic.id];
    if (!topicState) return { initial: [], extra: [] };

    const initialCommunities = topic.subrhetics.slice(
      0,
      topicState.displayedInitial
    );
    const extraCommunities = topicState.extraCommunities;

    return { initial: initialCommunities, extra: extraCommunities };
  };

  const renderCommunities = (topic: Topic) => {
    const { initial, extra } = getCommunitiesToDisplay(topic);
    const allCommunities = [...initial, ...extra];

    if (allCommunities.length === 0) {
      return (
        <Body className="text-[var(--black-100)]">
          Aucune communauté trouvée
        </Body>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allCommunities.map((community) => (
          <Community
            key={community.id}
            id={community.id.toString()}
            name={community.name}
            variant="developed"
            membersCount={community.members?.count || 0}
            iconUrl={community.icon?.url || ICONS.default_rhetic}
            className="mb-2"
          />
        ))}
      </div>
    );
  };

  const filteredCategories = getFilteredCategories();

  const handleCommunityCreated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <>
      <div className="flex flex-col gap-[21px]">
        <div className="flex flex-row justify-between items-center">
          <H1>Explore Communities</H1>
          <CreateCommunityModal
            onCommunityCreated={handleCommunityCreated}
            triggerComponent={
              <ActionButton variant="white" leftIconName="plus">
                Create Community
              </ActionButton>
            }
          />
        </div>

        <div className="flex flex-col gap-2.5 w-full">
          <div className="flex flex-row gap-2 overflow-x-scroll">
            <TinyButton
              isActive={selectedCategory === null}
              onClick={() => setSelectedCategory(null)}
            >
              All
            </TinyButton>
            {categories.map((category) => (
              <TinyButton
                key={category.id}
                isActive={selectedCategory === category.Name}
                onClick={() => setSelectedCategory(category.Name)}
              >
                {category.Name}
              </TinyButton>
            ))}
          </div>
          <Separator />
        </div>

        {isLoading ? (
          <Body>Loading categories and communities...</Body>
        ) : (
          filteredCategories.map((category) => (
            <div key={`${category.id}-${refreshKey}`} className="mb-6">
              {selectedCategory === null && (
                <H2 className="mb-4 text-white">{category.Name}</H2>
              )}

              {category.topics.map((topic) => (
                <div key={topic.id} className="flex flex-col gap-4 mb-8">
                  <H2>{topic.name}</H2>
                  {renderCommunities(topic)}

                  {topicCommunitiesState[topic.id]?.hasMore && (
                    <div className="w-full flex justify-center mt-2">
                      <ActionButton
                        leftIcon={false}
                        className="w-fit"
                        variant="gray"
                        onClick={() => handleLoadMore(topic.id)}
                        disabled={topicCommunitiesState[topic.id]?.isLoading}
                      >
                        {topicCommunitiesState[topic.id]?.isLoading
                          ? "Loading..."
                          : "Show more"}
                      </ActionButton>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </>
  );
}
