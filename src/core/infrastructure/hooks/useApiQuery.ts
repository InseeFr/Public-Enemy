import { ApiError } from "core/application/model/error";
import type { QueryFunction, QueryKey, UseQueryOptions } from "react-query";
import { useQuery } from "react-query";
import { useNotifier } from "..";

export const useApiQuery = <
  TQueryFnData = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  queryKey: TQueryKey,
  queryFn: QueryFunction<TQueryFnData, TQueryKey>,
  options?: Omit<
    UseQueryOptions<TQueryFnData, ApiError, TData, TQueryKey>,
    "queryKey" | "queryFn"
  > & { successMessage?: string; errorMessage?: string }
) => {
  const notifier = useNotifier();
  return useQuery<TQueryFnData, ApiError, TData, TQueryKey>(queryKey, queryFn, {
    ...options,
    onSuccess: (...args) => {
      if (options?.successMessage) {
        notifier.success(options.successMessage);
      }
      options?.onSuccess?.(...args);
    },
    onError: (error: ApiError) => {
      if (options?.errorMessage) {
        notifier.error(options.errorMessage);
      } else {
        notifier.error(error.message);
      }
      options?.onError?.(error);
    },
  });
};
