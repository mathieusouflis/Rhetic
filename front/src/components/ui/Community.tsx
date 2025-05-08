import classNames from "classnames";
import { Body } from "./Typography";
import { Avatar } from "./Avatar";

interface CommunityProps {
  id: number;
  name: string;
  iconUrl: string;
  isFavorite?: boolean;
  onToggleFavorite?: (id: number, isFavorite: boolean) => void;
  className?: string;
}

export const Community = ({
  id,
  name,
  iconUrl,
  isFavorite = false,
  onToggleFavorite,
  className,
}: CommunityProps) => {
  const handleFavoriteClick = () => {
    if (onToggleFavorite) {
      onToggleFavorite(id, !isFavorite);
    }
  };

  return (
    <div
      className={classNames(
        "flex flex-row w-full justify-between gap-2.5 items-center",
        className
      )}
    >
      <div className={classNames("flex flex-row gap-2.5 items-center")}>
        <Avatar src={iconUrl} alt={name} size={"sm"} />
        <Body>rh/{name.toLowerCase()}</Body>
      </div>
    </div>
  );
};
