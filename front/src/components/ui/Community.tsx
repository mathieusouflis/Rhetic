import classNames from "classnames";
import { Body, Small } from "./Typography";
import { Avatar } from "./Avatar";
import { formatNumber } from "@/lib/utils/format";
import Link from "next/link";
import { ENV, ICONS } from "@/config";

interface CommunityProps {
  id: string;
  name: string;
  iconUrl: string | null;
  desciption?: string;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string, isFavorite: boolean) => void;
  className?: string;
  variant?: "simple" | "developed";
  membersCount?: number;
}

export const Community = ({
  id,
  name,
  iconUrl,
  desciption = "",
  isFavorite = false,
  onToggleFavorite,
  className,
  membersCount = 0,
  variant = "simple",
}: CommunityProps) => {
  const handleFavoriteClick = () => {
    if (onToggleFavorite) {
      onToggleFavorite(id, !isFavorite);
    }
  };

  return (
    <Link
      href={`/communities/${id}`}
      className={classNames(
        "flex flex-row w-ful justify-between gap-2.5 items-center group",
        className
      )}
    >
      <div
        className={classNames("flex flex-row gap-2.5", {
          "items-center py-2 px-2.5": variant !== "developed",
          "items-start p-2.5 border border-[var(--black-500)] bg-[var(--black-700)] rounded-[10px] w-full":
            variant === "developed",
        })}
      >
        <Avatar
          src={
            iconUrl !== ICONS.default_rhetic && iconUrl !== null
              ? ENV.API_BASE_URL + iconUrl
              : ICONS.default_rhetic
          }
          alt={name}
          size={variant === "developed" ? "lg" : "sm"}
        />
        {variant === "developed" && (
          <div className="flex flex-col gap-1.5 w-full">
            <Body>rh/{name.toLowerCase()}</Body>
            <Small className="text-[var(--black-100)]">
              {formatNumber(membersCount)} members
            </Small>
            <Small className="text-[var(--black-100)] overflow-hidden text-ellipsis line-clamp-1 max-w-full min-h-[1.25rem]">
              {desciption || "\u00A0"}
            </Small>
          </div>
        )}
        {variant !== "developed" && (
          <Body className="group-hover:underline">rh/{name.toLowerCase()}</Body>
        )}
      </div>
    </Link>
  );
};
