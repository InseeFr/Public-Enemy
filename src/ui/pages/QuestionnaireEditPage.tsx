import { Grid } from "@mui/material";
import {
  Questionnaire,
  SurveyContext,
  SurveyUnitsMessages,
} from "core/application/model";
import { makeQuestionnaireUseCase } from "core/factory";
import { memo, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Block, Loader } from "ui/components/base";
import { QuestionnaireEditForm } from "ui/components/QuestionnaireEditForm";

export type QuestionnaireEditPageProps = {
  fetchSurveyContexts: () => Promise<SurveyContext[]>;
  editQuestionnaire: (questionnaire: Questionnaire) => Promise<Questionnaire>;
  checkSurveyUnitsCSVData: (
    poguesId: string,
    surveyUnitsData: File
  ) => Promise<SurveyUnitsMessages>;
};

export const QuestionnaireEditPage = memo(
  (props: QuestionnaireEditPageProps) => {
    const [questionnaire, setQuestionnaire] = useState<Questionnaire>();
    const questionnaireUseCase = makeQuestionnaireUseCase();
    const { id } = useParams();
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
      const idNumber = Number(id);
      setLoading(true);
      questionnaireUseCase
        .getQuestionnaire(idNumber)
        .then((questionnaireData) => {
          setQuestionnaire(questionnaireData);
          setLoading(false);
        });
    }, [id]);

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
                  checkSurveyUnitsCSVData={props.checkSurveyUnitsCSVData}
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
