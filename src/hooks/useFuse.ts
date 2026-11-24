import Fuse, { IFuseOptions, FuseResult } from "fuse.js";
import {
  useMemo,
  useState,
  useDeferredValue,
  SetStateAction,
  Dispatch,
} from "react";

interface UseFuseOptions<T> extends IFuseOptions<T> {
  /**
   * Maximum number of results to return.
   * If not provided, all results are returned.
   */
  limit?: number;

  /**
   * If true and query is empty, returns all items.
   */
  matchAllOnEmptyQuery?: boolean;
}

interface UseFuseResult<T> {
  result: FuseResult<T>[];
  query: string;
  loading: boolean;
  setQuery: Dispatch<SetStateAction<string>>;
}

export function useFuse<T>(
  list: T[],
  options: UseFuseOptions<T>,
): UseFuseResult<T> {
  const [query, setQuery] = useState<string>("");
  const deferredQuery = useDeferredValue(query);

  // No default limit: return all results unless explicitly specified
  const { limit, matchAllOnEmptyQuery = false, ...fuseOptions } = options;

  // Memoize Fuse instance
  const fuse = useMemo(
    () => new Fuse<T>(list, fuseOptions),
    [list, fuseOptions],
  );

  // Search results
  const result = useMemo<FuseResult<T>[]>(() => {
    if (!deferredQuery.trim() && matchAllOnEmptyQuery) {
      const items = limit !== undefined ? list.slice(0, limit) : list;

      return items.map((item, index) => ({
        item,
        refIndex: index,
      }));
    }

    // Return all matching results unless limit is explicitly provided
    return limit !== undefined
      ? fuse.search(deferredQuery.trim(), { limit })
      : fuse.search(deferredQuery.trim());
  }, [fuse, limit, matchAllOnEmptyQuery, deferredQuery, list]);

  const loading = deferredQuery !== query;

  return {
    result,
    query: deferredQuery,
    loading,
    setQuery,
  };
}
