import { Grid } from "@mui/material";
import {
  Questionnaire,
  SurveyContext,
  SurveyUnitsMessages,
} from "core/application/model";
import { useApiQuery } from "core/infrastructure/hooks/useApiQuery";
import { memo } from "react";
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

    const { isLoading, data: questionnaire } = useApiQuery(
      "questionnaire",
      () => {
        const idNumber = Number(id);
        return props.fetchQuestionnaire(idNumber);
      }
    );

    return (
      <>
        <Grid component="main" container justifyContent="center" spacing={3}>
          <Grid item xs={12} md={8}>
            <Block>
              {questionnaire ? (
                <QuestionnaireEditForm
                  questionnaire={questionnaire}
                  isEditMode={true}
                  fetchSurveyContexts={props.fetchSurveyContexts}
                  checkSurveyUnitsCsvData={props.checkSurveyUnitsCsvData}
                  saveQuestionnaire={props.editQuestionnaire}
                />
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
