import { useState, useCallback } from "react";
import { useMutation, useQuery } from "convex/react";
import { FunctionReference, OptionalRestArgs } from "convex/server";

export function useAsyncMutation<
  Mutation extends FunctionReference<"mutation">
>(mutation: Mutation) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const mutate = useMutation(mutation);

  const execute = useCallback(
    async (
      ...args: OptionalRestArgs<Mutation>
    ): Promise<Mutation["_returnType"]> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await mutate(...args);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [mutate]
  );

  const reset = useCallback(() => {
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    execute,
    isLoading,
    error,
    reset,
  };
}
