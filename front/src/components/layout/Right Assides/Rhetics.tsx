"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Modal } from "@/components/ui/Modal";
import { Body } from "@/components/ui/Typography";
import { Community } from "@/components/ui/Community";
import { Separator } from "@/components/ui/Separator";
import { SearchBar } from "@/components/ui/Searchbar";
import { ActionButton } from "@/components/ui/ActionButton";
import { CommunityCreationForm } from "@/components/ui/CommunityCreationForm";
import { useAuth } from "@/providers/AuthProvider";
import { fetchOne } from "@/lib/api/apiClient";
import { API_PATHS } from "@/lib/api/config";
import Link from "next/link";
import { ICONS } from "@/config";

interface SidebarProps {
  className?: string;
}

interface SubrheticItem {
  id: number;
  name: string;
  iconUrl?: string;
  documentId?: string;
}

export function Rhetics({ className = "" }: SidebarProps) {
  const { user } = useAuth();
  const [communities, setCommunities] = useState<SubrheticItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUserCommunities = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const currentUser = await fetchOne<any>(
        API_PATHS.USERS,
        user.id.toString(),
        {
          populate: {
            joined_subrhetics: {
              fields: ["id", "name", "documentId"],
              populate: { icon: { fields: ["url"] } },
            },
          },
        }
      );

      if (currentUser?.joined_subrhetics) {
        setCommunities(currentUser.joined_subrhetics);
      }
    } catch (error) {
      console.error("Error fetching user communities:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserCommunities();
  }, [user?.id]);

  const filteredCommunities = useMemo(() => {
    if (!searchTerm.trim()) return communities;
    return communities.filter((community) =>
      community.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, communities]);

  const handleCommunitySuccess = () => {
    setIsModalOpen(false);
    fetchUserCommunities();
  };

  return (
    <div className={`flex flex-col gap-2.5 w-[505px] ${className}`}>
      <div className="w-full flex flex-col gap-3 p-2.5 border border-[var(--black-500)] rounded-[10px]">
        <div className="flex flex-row justify-between items-center">
          <Body className="font-semibold">Mes communautés</Body>
        </div>

        <div className="flex flex-row gap-1.5">
          <SearchBar
            placeholder="Rechercher mes communautés"
            className="w-full"
            searchSize="tiny"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
            <Modal.Trigger asChild>
              <ActionButton
                variant="gray"
                className="w-fit"
                leftIconName="plus"
                onClick={() => setIsModalOpen(true)}
              />
            </Modal.Trigger>
            <Modal.Content className="w-[500px]">
              <CommunityCreationForm
                onSuccess={handleCommunitySuccess}
                onCancel={() => setIsModalOpen(false)}
              />
            </Modal.Content>
          </Modal>
        </div>

        <Separator direction="width" className="w-full" />

        {isLoading ? (
          <Body className="text-[var(--black-200)]">
            Chargement des communautés...
          </Body>
        ) : filteredCommunities.length > 0 ? (
          filteredCommunities.map((community) => (
            <Link
              href={`/communities/${community.documentId}`}
              key={community.documentId}
              className="block"
            >
              <Community
                id={community.documentId}
                iconUrl={ICONS.default_rhetic}
                name={community.name}
              />
            </Link>
          ))
        ) : (
          <Body className="text-[var(--black-200)]">
            Aucune communauté trouvée
          </Body>
        )}
      </div>
    </div>
  );
}
