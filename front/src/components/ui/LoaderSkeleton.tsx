"use client";
import React from "react";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const LoaderSkeleton: React.FC<LoaderProps> = ({
  size = "md",
  className = "",
}) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <div className="animate-spin rounded-full border-2 border-t-transparent border-[var(--black-300)] h-full w-full"></div>
    </div>
  );
};

export default LoaderSkeleton;
