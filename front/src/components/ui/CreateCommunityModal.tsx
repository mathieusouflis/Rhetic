"use client";

import React, { useState } from "react";
import { Modal } from "./Modal";
import { CommunityCreationForm } from "./CommunityCreationForm";
import LittleAction from "./LittleAction";
import { useAuth } from "@/providers/AuthProvider";
import { Body } from "./Typography";

interface CreateCommunityModalProps {
  onCommunityCreated?: () => void;
  triggerComponent?: React.ReactNode;
  triggerText?: string;
}

export const CreateCommunityModal: React.FC<CreateCommunityModalProps> = ({
  onCommunityCreated,
  triggerComponent,
  triggerText = "Create Community",
}) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleSuccess = () => {
    setTimeout(() => {
      setIsOpen(false);
      if (onCommunityCreated) {
        onCommunityCreated();
      }
    }, 500);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  if (!user) {
    return (
      <div className="text-[var(--black-300)]">
        <Body>You need to be logged in to create a community</Body>
      </div>
    );
  }

  return (
    <>
      {triggerComponent ? (
        <div onClick={() => setIsOpen(true)}>{triggerComponent}</div>
      ) : (
        <LittleAction
          iconName="plus"
          color="blue"
          onClick={() => setIsOpen(true)}
        >
          {triggerText}
        </LittleAction>
      )}

      <Modal open={isOpen} onOpenChange={setIsOpen}>
        <Modal.Content className="w-[550px] max-w-[95vw] max-h-[85vh] overflow-y-auto">
          <CommunityCreationForm
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </Modal.Content>
      </Modal>
    </>
  );
};
