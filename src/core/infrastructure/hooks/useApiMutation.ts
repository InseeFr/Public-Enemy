import { ApiError } from "core/application/model/error";
import type { MutationFunction } from "react-query";
import { useMutation, UseMutationOptions } from "react-query";
import { useNotifier } from "..";

export const useApiMutation = <
  TData = unknown,
  TVariables = void,
  TContext = unknown
>(
  callback: MutationFunction<TData, TVariables>,
  options?: Omit<
    UseMutationOptions<TData, ApiError, TVariables, TContext>,
    "mutationFn"
  > & { successMessage?: string; errorMessage?: string }
) => {
  const notifier = useNotifier();
  return useMutation<TData, ApiError, TVariables, TContext>(callback, {
    ...options,
    onSuccess: (...args) => {
      if (options?.successMessage) {
        notifier.success(options.successMessage);
      }
      options?.onSuccess?.(...args);
    },
    onError: (
      error: ApiError,
      variables: TVariables,
      context: TContext | undefined
    ) => {
      notifier.error(options?.errorMessage ?? error.message);
      options?.onError?.(error, variables, context);
    },
  });
};
