import { useState, useEffect, useCallback, useRef } from "react";
import { Advocate } from "../types/advocate";

interface UseAdvocatesInfiniteScrollResult {
  advocates: Advocate[];
  loading: boolean;
  hasMore: boolean;
  loadMoreAdvocates: () => void;
  resetAdvocates: () => void;
  error: string | null;
}

interface UseAdvocatesInfiniteScrollParams {
  searchTerm: string;
  limit?: number;
}

export function useAdvocatesInfiniteScroll({
  searchTerm,
  limit = 20,
}: UseAdvocatesInfiniteScrollParams): UseAdvocatesInfiniteScrollResult {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [nextCursor, setNextCursor] = useState<number | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const isFetchingRef = useRef(false);

  // Create URL parameters for the advocates API
  const createAdvocatesUrlParams = useCallback(
    (search: string, cursor?: number) => {
      const params = new URLSearchParams({
        limit: limit.toString(),
      });

      if (search.trim()) {
        params.append("search", search);
      }

      if (cursor) {
        params.append("cursor", cursor.toString());
      }

      return params;
    },
    [limit]
  );

  // Fetch advocates from the API
  const fetchAdvocatesFromAPI = useCallback(
    async (urlParams: URLSearchParams) => {
      const response = await fetch(`/api/advocates?${urlParams}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch advocates: ${response.status}`);
      }

      return response.json();
    },
    []
  );

  const fetchAdvocates = useCallback(
    async (search: string, cursor?: number, isReset = false) => {
      if (isFetchingRef.current) return;

      isFetchingRef.current = true;
      setLoading(true);
      setError(null);

      try {
        const urlParams = createAdvocatesUrlParams(search, cursor);
        const advocatesApiResponse = await fetchAdvocatesFromAPI(urlParams);

        if (isReset) {
          setAdvocates(advocatesApiResponse.data);
        } else {
          const appendAdvocates = (prev: Advocate[]) => [
            ...prev,
            ...advocatesApiResponse.data,
          ];

          setAdvocates(appendAdvocates);
        }

        setHasMore(advocatesApiResponse.pagination.hasMore);
        setNextCursor(advocatesApiResponse.pagination.nextCursor);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
        console.error("Error fetching advocates:", err);
      } finally {
        setLoading(false);
        isFetchingRef.current = false;
      }
    },
    [createAdvocatesUrlParams, fetchAdvocatesFromAPI]
  );

  const loadMoreAdvocates = useCallback(() => {
    if (hasMore && !loading) {
      fetchAdvocates(searchTerm, nextCursor, false);
    }
  }, [fetchAdvocates, searchTerm, nextCursor, hasMore, loading]);

  const resetAdvocates = useCallback(() => {
    isFetchingRef.current = false;
    setAdvocates([]);
    setNextCursor(undefined);
    setHasMore(true);
    setError(null);
  }, []);

  // Initial load and search term changes
  useEffect(() => {
    resetAdvocates();
    fetchAdvocates(searchTerm, undefined, true);
  }, [searchTerm, fetchAdvocates, resetAdvocates]);

  return {
    advocates,
    loading,
    hasMore,
    loadMoreAdvocates,
    resetAdvocates,
    error,
  };
}
