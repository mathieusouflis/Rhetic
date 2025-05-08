import { ReactNode, useState, useEffect } from "react";
import classNames from "classnames";
import Image from "next/image";
import Icon from "./Icons";

interface ImageSetProps {
  children: ReactNode[] & { length: 1 | 2 | 3 | 4 };
  className?: string;
}

const ImageSet = ({ className = "", children }: ImageSetProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const filteredChildren = Array.isArray(children) ? children.slice(0, 4) : [];

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedIndex(null);
      }
    };

    if (selectedIndex !== null) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [selectedIndex]);

  const handleImageClick = (index: number) => {
    setSelectedIndex(index);
  };

  const handleCloseFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIndex(null);
  };

  const navigateImage = (e: React.MouseEvent, direction: "prev" | "next") => {
    e.stopPropagation();
    if (selectedIndex === null) return;

    const newIndex =
      direction === "next"
        ? (selectedIndex + 1) % filteredChildren.length
        : (selectedIndex - 1 + filteredChildren.length) %
          filteredChildren.length;

    setSelectedIndex(newIndex);
  };

  if (!filteredChildren.length) return null;

  return (
    <div className={classNames("relative w-full", className)}>
      <div className="grid grid-cols-2 gap-2">
        {filteredChildren.map((child, index) => (
          <div
            key={index}
            className={classNames(
              "relative overflow-hidden rounded-md cursor-pointer",
              {
                "col-span-2": index === 0,
                "aspect-video": true,
              }
            )}
            onClick={() => handleImageClick(index)}
          >
            {child}
          </div>
        ))}
      </div>

      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={handleCloseFullscreen}
        >
          <button
            onClick={handleCloseFullscreen}
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
          >
            <Icon name="x" size={24} color="white" />
          </button>

          {filteredChildren.length > 1 && (
            <>
              <button
                onClick={(e) => navigateImage(e, "prev")}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
              >
                <Icon name="chevron_left" size={24} color="white" />
              </button>
              <button
                onClick={(e) => navigateImage(e, "next")}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
              >
                <Icon name="chevron_right" size={24} color="white" />
              </button>
            </>
          )}

          <div
            className="relative w-[80vw] h-[80vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full">
              {filteredChildren[selectedIndex]}
            </div>
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/50 text-white text-sm">
            {selectedIndex + 1} / {filteredChildren.length}
          </div>
        </div>
      )}
    </div>
  );
};

interface SetImageProps {
  src: string;
  alt: string;
}

const SetImage = ({ src, alt, ...props }: SetImageProps) => {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover h-full w-full rounded-[10px]"
      unoptimized
      {...props}
    />
  );
};

export { ImageSet, SetImage };
