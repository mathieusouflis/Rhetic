import classNames from "classnames";
import Image from "next/image";

type AvatarSize = "sm" | "md" | "lg" | "xl";

interface AvatarProps {
  src: string;
  alt: string;
  size?: AvatarSize;
  className?: string;
}

const sizeMap: Record<AvatarSize, { width: number; height: number }> = {
  sm: { width: 24, height: 24 },
  md: { width: 35, height: 35 },
  lg: { width: 40, height: 40 },
  xl: { width: 70, height: 70 },
};

export const Avatar = ({ src, alt, size = "md", className }: AvatarProps) => {
  const dimensions = sizeMap[size];

  return (
    <div
      className={classNames("relative rounded-full overflow-hidden", className)}
      style={dimensions}
    >
      <Image src={src} alt={alt} fill className="object-cover" unoptimized />
    </div>
  );
};
