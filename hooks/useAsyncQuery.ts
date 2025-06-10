import { useState } from "react";
import { useQuery } from "convex/react";
import { FunctionReference, OptionalRestArgs } from "convex/server";

export function useAsyncQuery<Query extends FunctionReference<"query">>(
  query: Query,
  ...args: OptionalRestArgs<Query>
) {
  const [error, setError] = useState<Error | null>(null);

  let data: Query["_returnType"] | undefined;
  let isLoading = true;

  try {
    data = useQuery(query, ...args);
    isLoading = data === undefined;
    if (data !== undefined && error) {
      setError(null);
    }
  } catch (err) {
    const queryError = err instanceof Error ? err : new Error(String(err));
    setError(queryError);
    isLoading = false;
  }

  return {
    data,
    isLoading,
    error,
    isSuccess: data !== undefined && !error,
    isError: error !== null,
  };
}
