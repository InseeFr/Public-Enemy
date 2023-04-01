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
import { useNotifier } from "core/infrastructure";
import { useApiQuery } from "core/infrastructure/hooks/useApiQuery";
import { getEnvVar } from "core/utils/env";
import { memo, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import { Block, Loader, Subtitle, Title } from "ui/components/base";

type SurveyUnitParams = {
  questionnaireId: string;
  modeName: string;
};

type SurveyUnitListPageProps = {
  fetchQuestionnaire: (id: number) => Promise<Questionnaire>;
  fetchSurveyUnitsData: (
    id: number,
    modeName: string
  ) => Promise<SurveyUnitsData>;
};

export const SurveyUnitListPage = memo((props: SurveyUnitListPageProps) => {
  const intl = useIntl();
  const notifier = useNotifier();
  const orchestratorUrl = getEnvVar("VITE_ORCHESTRATOR_URL");
  const { questionnaireId, modeName } = useParams<SurveyUnitParams>();
  const [canFetchData, setCanFetchData] = useState(false);

  const { isLoading: isQuestionnaireLoading, data: questionnaire } =
    useApiQuery(
      ["questionnaire", questionnaireId],
      () => {
        const idNumber = Number(questionnaireId);
        return props.fetchQuestionnaire(idNumber);
      },
      { enabled: canFetchData }
    );

  const { isLoading: isSurveyUnitsLoading, data: surveyUnitsData } =
    useApiQuery(
      ["surveyUnitsData", questionnaireId, modeName],
      () => {
        const idNumber = Number(questionnaireId);
        return props.fetchSurveyUnitsData(idNumber, modeName as string);
      },
      { enabled: canFetchData }
    );

  useEffect(() => {
    if (!(questionnaireId && modeName)) {
      notifier.error(
        intl.formatMessage({ id: "survey_unit_list_missing_parameters" })
      );
      return;
    }
    setCanFetchData(true);
  });

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
