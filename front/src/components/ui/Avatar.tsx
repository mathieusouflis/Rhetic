import classNames from "classnames";
import Image from "next/image";

type AvatarSize = "sm" | "md" | "lg" | "xl";

interface AvatarProps {
  src: string;
  alt: string;
  size?: AvatarSize;
  className?: string;
}

const sizeMap: Record<AvatarSize, { minWidth: number; height: number }> = {
  sm: { minWidth: 24, height: 24 },
  md: { minWidth: 35, height: 35 },
  lg: { minWidth: 40, height: 40 },
  xl: { minWidth: 70, height: 70 }, // Changed back to 70px for proper display
};

export const Avatar = ({ src, alt, size = "md", className }: AvatarProps) => {
  const dimensions = sizeMap[size];

  return (
    <div
      className={classNames(
        "flex relative rounded-full overflow-hidden",
        className
      )}
      style={dimensions}
    >
      <Image
        src={src}
        alt={alt}
        width={dimensions.minWidth}
        height={dimensions.height}
        className="object-cover"
        unoptimized
      />
    </div>
  );
};
