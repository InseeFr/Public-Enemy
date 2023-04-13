import { Grid } from "@mui/material";
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
import { useQueryClient } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { Block, Loader } from "ui/components/base";
import { QuestionnaireEditForm } from "ui/components/QuestionnaireEditForm";

export type QuestionnaireAddPageProps = {
  fetchSurveyContexts: () => Promise<SurveyContext[]>;
  fetchQuestionnaireFromPoguesId: (poguesId: string) => Promise<Questionnaire>;
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

  const { isLoading } = useApiQuery(
    ["questionnaire-pogues", questionnaire],
    () => {
      if (questionnaire) {
        return props.fetchQuestionnaireFromPoguesId(questionnaire.poguesId);
      }
    },
    {
      enabled: false,
      notify: false,
      // go to the update page if questionnaire already exists
      onSuccess: (questionnaire: Questionnaire) => {
        navigate(`/questionnaires/${questionnaire.id}/edit`);
      },
    }
  );

  const { mutate: saveQuestionnaire, isLoading: isSubmitting } = useApiMutation(
    (questionnaire: Questionnaire) => props.addQuestionnaire(questionnaire),
    {
      onError: () => {
        queryClient.invalidateQueries({
          queryKey: ["questionnaire-pogues"],
          refetchInactive: true,
        });
      },
    }
  );

  return (
    <>
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
    </>
  );
});

QuestionnaireAddPage.displayName = "QuestionnaireAddPage";
