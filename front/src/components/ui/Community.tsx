import classNames from "classnames";
import Image from "next/image";
import { Body } from "./Typography";
import Icon from "./Icons";
import { Avatar } from "./Avatar";

interface CommunityProps {
  name: string;
  iconUrl: string;
  className?: string;
}

export const Community = ({ name, iconUrl, className }: CommunityProps) => {
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
      <Icon name="star" size={20} />
    </div>
  );
};
