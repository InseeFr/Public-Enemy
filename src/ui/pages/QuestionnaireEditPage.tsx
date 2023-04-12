import { Alert, AlertTitle, Grid } from "@mui/material";
import {
  Questionnaire,
  SurveyContext,
  SurveyUnitsMessages,
} from "core/application/model";
import { useApiMutation } from "core/infrastructure/hooks/useApiMutation";
import { useApiQuery } from "core/infrastructure/hooks/useApiQuery";
import { memo } from "react";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import { Block, Loader } from "ui/components/base";
import { QuestionnaireEditForm } from "ui/components/QuestionnaireEditForm";

export type QuestionnaireEditPageProps = {
  fetchQuestionnaire: (id: number) => Promise<Questionnaire>;
  fetchSurveyContexts: () => Promise<SurveyContext[]>;
  editQuestionnaire: (questionnaire: Questionnaire) => Promise<Questionnaire>;
  checkSurveyUnitsCsvData: (
    poguesId: string,
    surveyUnitsData: File
  ) => Promise<SurveyUnitsMessages>;
};

export const QuestionnaireEditPage = memo(
  (props: QuestionnaireEditPageProps) => {
    const { id } = useParams();
    const intl = useIntl();

    const { isLoading, data: questionnaire } = useApiQuery(
      ["questionnaire", id],
      () => {
        const idNumber = Number(id);
        return props.fetchQuestionnaire(idNumber);
      }
    );

    const { mutate: saveQuestionnaire, isLoading: isSubmitting } =
      useApiMutation((questionnaire: Questionnaire) =>
        props.editQuestionnaire(questionnaire)
      );

    return (
      <>
        <Grid component="main" container justifyContent="center" spacing={3}>
          <Grid item xs={12} md={8}>
            <Block>
              {questionnaire ? (
                <>
                  {!questionnaire.isSynchronized && (
                    <Alert severity="error">
                      <AlertTitle>
                        {intl.formatMessage({
                          id: "questionnaire_notsynchronized_title",
                        })}
                      </AlertTitle>
                      {intl.formatMessage({
                        id: "questionnaire_notsynchronized_message",
                      })}
                    </Alert>
                  )}

                  <QuestionnaireEditForm
                    questionnaire={questionnaire}
                    isEditMode={true}
                    fetchSurveyContexts={props.fetchSurveyContexts}
                    checkSurveyUnitsCsvData={props.checkSurveyUnitsCsvData}
                    saveQuestionnaire={saveQuestionnaire}
                    isSubmitting={isSubmitting}
                  />
                </>
              ) : (
                <Loader isLoading={isLoading}></Loader>
              )}
            </Block>
          </Grid>
        </Grid>
      </>
    );
  }
);

QuestionnaireEditPage.displayName = "QuestionnaireEditPage";
