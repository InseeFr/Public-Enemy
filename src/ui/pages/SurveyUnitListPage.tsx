import PreviewIcon from "@mui/icons-material/Preview";
import {
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Questionnaire, SurveyUnitsData } from "core/application/model";
import { makeQuestionnaireUseCase, makeSurveyUnitUseCase } from "core/factory";
import { useNotifier } from "core/infrastructure";
import { memo, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import { Block, Loader, Subtitle, Title } from "ui/components/base";

type SurveyUnitParams = {
  questionnaireId: string;
  modeName: string;
};

export const SurveyUnitListPage = memo(() => {
  const [surveyUnitsData, setSurveyUnitsData] = useState<SurveyUnitsData>();
  const [questionnaire, setQuestionnaire] = useState<Questionnaire>();
  const surveyUnitUseCase = makeSurveyUnitUseCase();
  const questionnaireUseCase = makeQuestionnaireUseCase();

  const intl = useIntl();
  const [isSurveyUnitsLoading, setSurveyUnitsLoading] = useState(true);
  const [isQuestionnaireLoading, setQuestionnaireLoading] = useState(true);
  const notifier = useNotifier();
  const orchestratorUrl = process.env.REACT_APP_ORCHESTRATOR_URL;
  const { questionnaireId, modeName } = useParams<SurveyUnitParams>();

  useEffect(() => {
    // react router doesn't type, but a check has already been done in Application.tsx ... (\\d+))
    if (!(questionnaireId && modeName)) {
      return;
    }
    const questionnaireIdNumber = parseInt(questionnaireId, 10);
    loadSurveyUnitsData(questionnaireIdNumber, modeName);

    questionnaireUseCase
      .getQuestionnaire(questionnaireIdNumber)
      .then((questionnaireData) => {
        setQuestionnaire(questionnaireData);
        setQuestionnaireLoading(false);
      });
  }, [questionnaireId, modeName]);

  const loadSurveyUnitsData = (questionnaireId: number, mode: string): void => {
    setSurveyUnitsLoading(true);
    surveyUnitUseCase
      .getSurveyUnitsData(questionnaireId, mode)
      .then((surveyUnitsData) => {
        setSurveyUnitsData(surveyUnitsData);
        setSurveyUnitsLoading(false);
      })
      .catch((err) => {
        notifier.error(intl.formatMessage({ id: "error_request_failed" }));
        console.log(err);
        setSurveyUnitsLoading(false);
      });
  };

  return (
    <Grid component="main" container justifyContent="center">
      <Grid item xs={12} md={6}>
        <Block>
          <Loader isLoading={isSurveyUnitsLoading && isQuestionnaireLoading}>
            <Title>
              {intl.formatMessage({ id: "survey_unit_list_label" })}
            </Title>

            <Subtitle>
              <>
                {questionnaire?.label}
                <br />
                {intl.formatMessage(
                  { id: "survey_unit_mode_label" },
                  { modeName: modeName }
                )}
              </>
            </Subtitle>

            <TableContainer component={Paper}>
              <Table aria-label="surveyUnit table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      {intl.formatMessage({
                        id: "survey_unit_id",
                      })}
                    </TableCell>
                    <TableCell align="center">
                      {intl.formatMessage({
                        id: "survey_unit_list_actions",
                      })}
                    </TableCell>
                  </TableRow>
                </TableHead>
                {
                  <TableBody>
                    {questionnaire &&
                      surveyUnitsData?.surveyUnits?.map((surveyUnit) => (
                        <TableRow key={surveyUnit.id}>
                          <TableCell component="th" scope="row">
                            {surveyUnit.displayableId}
                          </TableCell>
                          <TableCell align="center">
                            <a
                              target="_blank"
                              href={`${orchestratorUrl}/questionnaire/${surveyUnitsData.questionnaireModelId}/unite-enquetee/${surveyUnit.id}`}
                              aria-label={intl.formatMessage(
                                { id: "survey_unit_list_new_window" },
                                { surveyUnitId: surveyUnit.displayableId }
                              )}
                              rel="noreferrer"
                            >
                              <IconButton aria-label="edit">
                                <PreviewIcon />
                              </IconButton>
                            </a>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                }
              </Table>
            </TableContainer>
          </Loader>
        </Block>
      </Grid>
    </Grid>
  );
});

SurveyUnitListPage.displayName = "SurveyUnitListPage";
