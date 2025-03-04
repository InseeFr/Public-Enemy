import {
  MutationFunction,
  MutationKey,
  UseMutationOptions,
  useMutation,
} from '@tanstack/react-query'
import { ApiErrorDetails } from 'core/application/model/error'

export const useCsvApiMutation = <
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
    UseMutationOptions<TData, ApiErrorDetails, TVariables, TContext>,
    'mutationFn'
  >
}) => {
  return useMutation<TData, ApiErrorDetails, TVariables, TContext>({
    mutationKey,
    mutationFn,
    ...options,
  })
}
