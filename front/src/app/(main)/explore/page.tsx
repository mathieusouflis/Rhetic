"use client";

import { ActionButton } from "@/components/ui/ActionButton";
import { Separator } from "@/components/ui/Separator";
import { TinyButton } from "@/components/ui/TinyButton";
import { Body, H1, H2 } from "@/components/ui/Typography";
import { TAG_LIST, TagGroup } from "@/config/tags";
import { useState } from "react";

export default function Page() {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const renderCommunities = (tag: string) => {
    return <Body>Communities</Body>;
  };

  const filteredTags = selectedTag
    ? TAG_LIST.find((group) => group.name === selectedTag)?.tags || []
    : TAG_LIST.flatMap((group) => group.tags);

  return (
    <>
      <div className="flex flex-col gap-[21px]">
        <H1>Explore Communities</H1>
        <div className="flex flex-col gap-2.5 w-full">
          <div className="flex flex-row gap-2 overflow-x-scroll">
            <TinyButton
              isActive={selectedTag === null}
              onClick={() => setSelectedTag(null)}
            >
              All
            </TinyButton>
            {TAG_LIST.map((group, index) => (
              <TinyButton
                key={index}
                isActive={selectedTag === group.name}
                onClick={() => setSelectedTag(group.name)}
              >
                {group.name}
              </TinyButton>
            ))}
          </div>
          <Separator />
        </div>
        {filteredTags.map((tag, index) => (
          <div key={tag} className="flex flex-col gap-4">
            <H2>{tag}</H2>
            {renderCommunities(tag)}
            <div className="w-full flex justify-center">
              <ActionButton leftIcon={false} className="w-fit" variant="gray">
                Show more
              </ActionButton>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
