import { ApiErrorDetails } from "core/application/model/error";
import type { MutationFunction } from "react-query";
import { useMutation, UseMutationOptions } from "react-query";

export const useCsvApiMutation = <
  TData = unknown,
  TVariables = void,
  TContext = unknown
>(
  callback: MutationFunction<TData, TVariables>,
  options?: Omit<
    UseMutationOptions<TData, ApiErrorDetails, TVariables, TContext>,
    "mutationFn"
  > & { successMessage?: string; errorMessage?: string }
) => {
  return useMutation<TData, ApiErrorDetails, TVariables, TContext>(callback, {
    ...options,
  });
};
