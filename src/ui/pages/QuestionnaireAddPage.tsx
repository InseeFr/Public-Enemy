import { Grid } from "@mui/material";
import {
  Questionnaire,
  SurveyContext,
  SurveyUnitsMessages,
} from "core/application/model";
import { useNotifier } from "core/infrastructure";
import { memo, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useLocation, useNavigate } from "react-router-dom";
import { Block } from "ui/components/base";
import { QuestionnaireEditForm } from "ui/components/QuestionnaireEditForm";

export type QuestionnaireAddPageProps = {
  fetchSurveyContexts: () => Promise<SurveyContext[]>;
  addQuestionnaire: (questionnaire: Questionnaire) => Promise<Questionnaire>;
  checkSurveyUnitsCSVData: (
    poguesId: string,
    surveyUnitsCSVData: File
  ) => Promise<SurveyUnitsMessages>;
};

export const QuestionnaireAddPage = memo((props: QuestionnaireAddPageProps) => {
  const notifier = useNotifier();
  const location = useLocation();
  const navigate = useNavigate();
  const intl = useIntl();
  const [questionnaire, setQuestionnaire] = useState<Questionnaire>();

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

  return (
    <>
      <Grid component="main" container justifyContent="center" spacing={3}>
        <Grid item xs={12} md={8}>
          <Block>
            {questionnaire && (
              <QuestionnaireEditForm
                questionnaire={questionnaire}
                isEditMode={false}
                fetchSurveyContexts={props.fetchSurveyContexts}
                checkSurveyUnitsCSVData={props.checkSurveyUnitsCSVData}
                saveQuestionnaire={props.addQuestionnaire}
              />
            )}
          </Block>
        </Grid>
      </Grid>
    </>
  );
});

QuestionnaireAddPage.displayName = "QuestionnaireAddPage";
