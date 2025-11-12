import { Alert, AlertTitle, Grid } from "@mui/material";
import {
  Questionnaire,
  SurveyContext,
  InterrogationsMessages,
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
  checkInterrogationsCsvData: (
    poguesId: string,
    interrogationsData: File
  ) => Promise<InterrogationsMessages>;
  getInterrogationsSchemaCSV: (poguesId: string) => Promise<void>;
  getExistingInterrogationsSchemaCSV: (id: number) => Promise<void>;
};

export const QuestionnaireEditPage = memo(
  (props: QuestionnaireEditPageProps) => {
    const { id } = useParams();
    const intl = useIntl();

    const { isLoading, data: questionnaire } = useApiQuery({
      queryKey: ["questionnaire", id],
      queryFn: () => {
        const idNumber = Number(id);
        return props.fetchQuestionnaire(idNumber);
      },
    });

    const { mutate: saveQuestionnaire, isPending: isSubmitting } =
      useApiMutation({
        mutationKey: ["questionnaire-edit", questionnaire],
        mutationFn: (questionnaire: Questionnaire) =>
          props.editQuestionnaire(questionnaire),
      });

    return (
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
                  checkInterrogationsCsvData={props.checkInterrogationsCsvData}
                  getExistingInterrogationsSchemaCSV={
                    props.getExistingInterrogationsSchemaCSV
                  }
                  getInterrogationsSchemaCSV={props.getInterrogationsSchemaCSV}
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
    );
  }
);

QuestionnaireEditPage.displayName = "QuestionnaireEditPage";
