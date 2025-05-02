import React from "react";
import { Avatar } from "./Avatar";
import { TextInput } from "./TextInput";
import { BigButton } from "./BigButton";
import Icon from "./Icons";
import { ActionButton } from "./ActionButton";

interface PostWriterProps {}

const PostWriter: React.FC<PostWriterProps> = () => {
  return (
    <div className="flex flex-row gap-2.5 pb-4 w-full">
      <Avatar
        src="https://images.unsplash.com/photo-1726066012604-a309bd0575df?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="User Avatar"
        size="md"
      />
      <div className="flex flex-col gap-4 w-full">
        <TextInput className="w-full h-full" variant="black" />
        <div className="flex flex-row gap-2.5 w-full justify-between items-center">
          <div className="flex flex-row gap-2.5">
            <Icon name="image_plus" size={17} color="var(--yellow)" />
            <Icon name="video" size={17} color="var(--yellow)" />
            <Icon name="table" size={17} color="var(--yellow)" />
            <div className="h-auto w-px bg-[var(--black-100)]" />
            <Icon name="bold" size={17} color="var(--yellow)" />
            <Icon name="italic" size={17} color="var(--yellow)" />
            <Icon name="strikethrough" size={17} color="var(--yellow)" />
            <Icon name="code" size={17} color="var(--yellow)" />
            <Icon name="eye_off" size={17} color="var(--yellow)" />
          </div>
          <ActionButton leftIcon={false} variant="white">
            <strong>Post</strong>
          </ActionButton>
        </div>
      </div>
    </div>
  );
};

export default PostWriter;
