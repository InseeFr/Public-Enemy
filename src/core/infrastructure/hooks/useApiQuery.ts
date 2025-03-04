import {
  QueryFunction,
  QueryKey,
  UseQueryOptions,
  useQuery,
} from '@tanstack/react-query'
import { ApiError } from 'core/application/model/error'

export const useApiQuery = <
  TQueryFnData = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>({
  queryKey,
  queryFn,
  options,
}: {
  queryKey: TQueryKey
  queryFn: QueryFunction<TQueryFnData, TQueryKey>
  options?: Omit<
    UseQueryOptions<TQueryFnData, ApiError, TData, TQueryKey>,
    'queryKey' | 'queryFn'
  >
}) => {
  // const notifier = useNotifier();
  return useQuery({
    queryKey,
    queryFn,
    ...options,

    // onSuccess: (...args: unknown[]) => {
    //   if (options?.successMessage) {
    //     notifier.success(options.successMessage);
    //   }
    //   options?.onSuccess?.(...args);
    // },
    // onError: (error: ApiError) => {
    //   options?.notify !== false &&
    //     notifier.error(options?.errorMessage ?? error.message);
    //   options?.onError?.(error);
    // },
  })
}
