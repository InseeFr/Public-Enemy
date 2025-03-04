import {
  MutationFunction,
  MutationKey,
  UseMutationOptions,
  useMutation,
} from '@tanstack/react-query'
import { ApiError } from 'core/application/model/error'

import useNotifier from '../Notifier'

export const useApiMutation = <
  TData = unknown,
  TVariables = void,
  TContext = unknown,
>({
  mutationKey,
  mutationFn,
  options,
}: {
  mutationKey: MutationKey
  mutationFn: MutationFunction<TData, TVariables>
  options?: Omit<
    UseMutationOptions<TData, ApiError, TVariables, TContext>,
    'mutationFn'
  > & { successMessage?: string; errorMessage?: string }
}) => {
  const notifier = useNotifier()
  return useMutation<TData, ApiError, TVariables, TContext>({
    mutationKey,
    mutationFn,
    onSuccess: (...args) => {
      if (options?.successMessage) {
        notifier.success(options.successMessage)
      }
      options?.onSuccess?.(...args)
    },
    onError: (
      error: ApiError,
      variables: TVariables,
      context: TContext | undefined,
    ) => {
      notifier.error(options?.errorMessage ?? error.message)
      options?.onError?.(error, variables, context)
    },
  })
}
