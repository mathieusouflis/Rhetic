"use client";

import { useState, useEffect, useRef, ReactNode } from "react";
import { Body } from "@/components/ui/Typography";

interface TabsProps {
  tabs: string[];
  activeTab: number;
  onChange: (index: number) => void;
  className?: string;
}

export const Tabs = ({
  tabs,
  activeTab,
  onChange,
  className = "",
}: TabsProps) => {
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const setTabRef = (el: HTMLButtonElement | null, index: number) => {
    tabRefs.current[index] = el;
  };

  useEffect(() => {
    const activeTabElement = tabRefs.current[activeTab];
    if (activeTabElement) {
      setIndicatorStyle({
        left: activeTabElement.offsetLeft,
        width: activeTabElement.offsetWidth,
      });
    }
  }, [activeTab]);

  return (
    <div
      className={`relative flex border-b border-[var(--black-500)] ${className}`}
    >
      <div className="flex relative">
        {tabs.map((tab, index) => (
          <button
            key={tab}
            ref={(el) => setTabRef(el, index)}
            onClick={() => onChange(index)}
            className={`px-4 py-2 text-[var(--black-200)] relative ${
              activeTab === index ? "text-[var(--white)]" : ""
            }`}
          >
            <Body>{tab}</Body>
          </button>
        ))}
        <div
          className="absolute bottom-0 h-0.5 bg-[var(--white)] transition-all duration-300 ease-in-out"
          style={{
            left: indicatorStyle.left,
            width: indicatorStyle.width,
          }}
        />
      </div>
    </div>
  );
};

interface TabPanelProps {
  children: ReactNode;
  value: number;
  index: number;
  className?: string;
}

export const TabPanel = ({
  children,
  value,
  index,
  className = "",
}: TabPanelProps) => {
  return value === index ? <div className={className}>{children}</div> : null;
};

export default Tabs;
