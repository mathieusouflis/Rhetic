//TODO: FINIR ICI

import { ReactNode, useState } from "react";
import classNames from "classnames";
import Image from "next/image";

interface ImageSetProps {
  children: ReactNode[] & { length: 1 | 2 | 3 | 4 };
  className?: string;
}

const ImageSet = ({ className = "", children }: ImageSetProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const filteredChildren = children.slice(0, 4);

  const handleImageClick = (index: number) => {
    setSelectedIndex(index);
  };

  const handleCloseFullscreen = () => {
    setSelectedIndex(null);
  };

  return (
    <div className={classNames("relative w-full", className)}>
      <div className="flex flex-row w-full gap-2">
        {filteredChildren.length >= 1 && filteredChildren[0]}
        {filteredChildren.length >= 2 && filteredChildren[1]}
      </div>
      <div className="flex flex-row w-full gap-2">
        {filteredChildren.length >= 3 && filteredChildren[2]}
        {filteredChildren.length >= 4 && filteredChildren[3]}
      </div>
      <div className={classNames("flex flex-wrap w-full gap-1.5")}>
        {/* {filteredChildren.map((child, index) => (
          <div
            key={index}
            className={classNames(
              "relative overflow-hidden rounded-md cursor-pointer",
              {
                "w-full h-full": index === 0 || index === 2,
                "w-1/2 h-full": index === 1 || index === 3,
              }
            )}
            onClick={() => handleImageClick(index)}
          >
            {child}
          </div>
        ))} */}
      </div>

      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
          onClick={handleCloseFullscreen}
        >
          <div className="relative max-w-[90vw] max-h-[90vh]">
            {filteredChildren[selectedIndex]}
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

const SetImage = ({ src, alt }: SetImageProps) => {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover h-full w-full rounded-[10px]"
      unoptimized
    />
  );
};

export { ImageSet, SetImage };
