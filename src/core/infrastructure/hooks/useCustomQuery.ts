import { useApiQuery } from "./useApiQuery";

export function useCustomQuery(
  fetchQuestionnaireFromPoguesId: any,
  fetchPoguesQuestionnaire: any,
  poguesIdInput: string
) {
  const firstQuery = useApiQuery({
    queryKey: ["questionnaire", poguesIdInput],
    queryFn: () => {
      return fetchQuestionnaireFromPoguesId(poguesIdInput);
    },
    options: {
      enabled: false,
    },
  });

  const secondQuery = useApiQuery({
    queryKey: ["questionnaire-", poguesIdInput],
    queryFn: () => {
      return fetchPoguesQuestionnaire(poguesIdInput);
    },
    options: {
      enabled: firstQuery.isError,
    },
  });

  return {
    launch: firstQuery.refetch,
    questionnairePoguesId: firstQuery.data?.id,
    firstSuccess: firstQuery.isSuccess,
    secondSuccess: secondQuery.isSuccess,
    questionnairePogues: secondQuery.data,
    isLoadingPoguesQuestionnaire: firstQuery.isLoading || secondQuery.isLoading,
    globalError: secondQuery.isError,
  };
}
