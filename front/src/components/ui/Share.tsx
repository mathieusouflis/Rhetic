import React from "react";
import LittleAction from "./LittleAction";
import { ENV, ROUTES } from "@/config";

type ShareType = "comment" | "post";

interface ShareProps {
  shareType: ShareType;
  itemId: string;
}

const Share = ({ shareType, itemId }: ShareProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const baseRoute = ENV.APP_URL;
    const contentRoute =
      shareType === "post" ? ROUTES.CONTENT.POST : ROUTES.CONTENT.COMMENT;
    const fullPath = contentRoute.path.replace(":id", itemId);
    navigator.clipboard.writeText(`${baseRoute}${fullPath}`);
  };

  return <LittleAction iconName="share" color="yellow" onClick={handleClick} />;
};

Share.displayName = "Share";

export default Share;
