import { useState, useEffect, useRef, useCallback } from "react";

interface UseInfiniteScrollOptions {
  threshold?: number;
  initialPage?: number;
}

export function useInfiniteScroll(
  callback: () => void,
  hasMore: boolean,
  options: UseInfiniteScrollOptions = {}
) {
  const { threshold = 100, initialPage = 1 } = options;
  const [page, setPage] = useState<number>(initialPage);
  const observer = useRef<IntersectionObserver | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore) {
        setPage((prevPage) => prevPage + 1);
        callback();
      }
    },
    [hasMore, callback]
  );

  useEffect(() => {
    const currentLoaderRef = loaderRef.current;
    if (currentLoaderRef) {
      if (observer.current) {
        observer.current.disconnect();
      }

      observer.current = new IntersectionObserver(handleObserver, {
        root: null,
        rootMargin: `0px 0px ${threshold}px 0px`,
        threshold: 0.1,
      });

      observer.current.observe(currentLoaderRef);
    }

    return () => {
      if (observer.current && currentLoaderRef) {
        observer.current.unobserve(currentLoaderRef);
      }
    };
  }, [handleObserver, threshold]);

  return { loaderRef, page };
}
