import { useEffect, useCallback, useRef } from "react";

interface UseInfiniteScrollOptions {
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  threshold?: number;
}

export function useInfiniteScroll({
  loading,
  hasMore,
  onLoadMore,
  threshold = 200,
}: UseInfiniteScrollOptions) {
  const lastCallRef = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleScroll = useCallback(() => {
    // Debounce para evitar múltiplas chamadas
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      const now = Date.now();

      // Evitar chamadas muito frequentes (mínimo 500ms entre calls)
      if (now - lastCallRef.current < 500) {
        return;
      }

      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;

      if (
        scrollTop + clientHeight >= scrollHeight - threshold &&
        !loading &&
        hasMore
      ) {
        lastCallRef.current = now;
        onLoadMore();
      }
    }, 100); // Debounce de 100ms
  }, [loading, hasMore, onLoadMore, threshold]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [handleScroll]);
}
