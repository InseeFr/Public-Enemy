import { Grid } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import {
  Questionnaire,
  SurveyContext,
  SurveyUnitsMessages,
} from "core/application/model";
import { useNotifier } from "core/infrastructure";
import { useApiMutation } from "core/infrastructure/hooks/useApiMutation";
import { useApiQuery } from "core/infrastructure/hooks/useApiQuery";
import { memo, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useLocation, useNavigate } from "react-router-dom";
import { Block, Loader } from "ui/components/base";
import { QuestionnaireEditForm } from "ui/components/QuestionnaireEditForm";

export type QuestionnaireAddPageProps = {
  fetchSurveyContexts: () => Promise<SurveyContext[]>;
  fetchQuestionnaireFromPoguesId: (poguesId?: string) => Promise<Questionnaire>;
  addQuestionnaire: (questionnaire: Questionnaire) => Promise<Questionnaire>;
  checkSurveyUnitsCsvData: (
    poguesId: string,
    surveyUnitsCsvData: File
  ) => Promise<SurveyUnitsMessages>;
};

export const QuestionnaireAddPage = memo((props: QuestionnaireAddPageProps) => {
  const notifier = useNotifier();
  const location = useLocation();
  const navigate = useNavigate();
  const intl = useIntl();
  const [questionnaire, setQuestionnaire] = useState<Questionnaire>();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!location?.state) {
      notifier.error(intl.formatMessage({ id: "questionnaire_add_notfound" }));
      navigate("/questionnaires");
      return;
    }
    setQuestionnaire({
      ...location.state,
      context: "",
    });
  }, [location]);

  const {
    isLoading,
    data: questionnaireResponse,
    isSuccess,
  } = useApiQuery({
    queryKey: ["questionnaire-pogues"],
    queryFn: () => {
      return props.fetchQuestionnaireFromPoguesId(questionnaire?.poguesId);
    },
    options: { enabled: !!questionnaire },
  });

  if (isSuccess && questionnaireResponse) {
    navigate(`/questionnaires/${questionnaireResponse.id}/edit`);
  }

  const {
    mutate: saveQuestionnaire,
    isPending: isSubmitting,
    isError,
  } = useApiMutation({
    mutationKey: ["questionnaire", questionnaire],
    mutationFn: (questionnaire: Questionnaire) =>
      props.addQuestionnaire(questionnaire),
  });

  if (isError) {
    queryClient.invalidateQueries({
      queryKey: ["questionnaire-pogues"],
      refetchType: "inactive",
    });
  }

  return (
    <Grid component="main" container justifyContent="center" spacing={3}>
      <Grid item xs={12} md={8}>
        <Block>
          <Loader isLoading={isLoading}>
            {questionnaire && (
              <QuestionnaireEditForm
                questionnaire={questionnaire}
                isEditMode={false}
                fetchSurveyContexts={props.fetchSurveyContexts}
                checkSurveyUnitsCsvData={props.checkSurveyUnitsCsvData}
                saveQuestionnaire={saveQuestionnaire}
                isSubmitting={isSubmitting}
              />
            )}
          </Loader>
        </Block>
      </Grid>
    </Grid>
  );
});

QuestionnaireAddPage.displayName = "QuestionnaireAddPage";
