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
import { useQueryClient } from "@tanstack/react-query";
import { Questionnaire, InterrogationsData } from "core/application/model";
import { useNotifier } from "core/infrastructure";
import { useApiMutation } from "core/infrastructure/hooks/useApiMutation";
import { useApiQuery } from "core/infrastructure/hooks/useApiQuery";
import { getEnvVar } from "core/utils/configuration/env";
import { memo, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import { Block, Loader, Subtitle, Title } from "ui/components/base";
import { InterrogationResetButton } from "ui/components/InterrogationResetButton";

type InterrogationParams = {
  questionnaireId: string;
  modeName: string;
};

type InterrogationListPageProps = {
  fetchQuestionnaire: (id: number) => Promise<Questionnaire>;
  fetchInterrogationsData: (
    id: number,
    modeName: string
  ) => Promise<InterrogationsData>;
  resetInterrogation: (interrogationId: string) => Promise<void>;
};

export const InterrogationListPage = memo((props: InterrogationListPageProps) => {
  const intl = useIntl();
  const notifier = useNotifier();
  const orchestratorUrl = getEnvVar("VITE_ORCHESTRATOR_URL");
  const { questionnaireId, modeName } = useParams<InterrogationParams>();
  const [canFetchData, setCanFetchData] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!(questionnaireId && modeName)) {
      notifier.error(
        intl.formatMessage({ id: "survey_unit_list_missing_parameters" })
      );
      return;
    }
    setCanFetchData(true);
  });

  const { isLoading: isQuestionnaireLoading, data: questionnaire } =
    useApiQuery({
      queryKey: ["questionnaire", questionnaireId],
      queryFn: () => {
        const idNumber = Number(questionnaireId);
        return props.fetchQuestionnaire(idNumber);
      },
      options: { enabled: canFetchData },
    });

  const { isLoading: isInterrogationsLoading, data: interrogationsData } =
    useApiQuery({
      queryKey: ["interrogationsData", questionnaireId, modeName],
      queryFn: () => {
        const idNumber = Number(questionnaireId);
        return props.fetchInterrogationsData(idNumber, modeName as string);
      },
      options: { enabled: canFetchData },
    });

    console.log("interrogationsData",interrogationsData)

  const {
    mutate: resetInterrogation,
    isPending: isResetting,
    isSuccess,
  } = useApiMutation({
    mutationKey: ["reset-survey-unit"],
    mutationFn: (interrogationId: string) => props.resetInterrogation(interrogationId),
  });

  if (isSuccess) {
    queryClient.invalidateQueries({
      queryKey: ["interrogationsData", questionnaireId, modeName],
    });
  }

  return (
    <Grid component="main" container justifyContent="center">
      <Grid item xs={12} md={6}>
        <Block>
          <Loader isLoading={isInterrogationsLoading || isQuestionnaireLoading}>
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
              <Table aria-label="interrogation table">
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
                      interrogationsData?.interrogationRests?.map((interrogation) => (
                        <TableRow key={interrogation.id}>
                          <TableCell component="th" scope="row">
                            {interrogation.displayableId}
                          </TableCell>
                          <TableCell align="center">
                            <a
                              target="_blank"
                              href={interrogation.url}
                              aria-label={intl.formatMessage(
                                { id: "survey_unit_list_new_window" },
                                { interrogationId: interrogation.displayableId }
                              )}
                              rel="noreferrer"
                            >
                              <IconButton aria-label="edit">
                                <PreviewIcon />
                              </IconButton>
                            </a>

                            <InterrogationResetButton
                              interrogationId={interrogation.id}
                              mutateReset={{
                                resetInterrogation: resetInterrogation,
                                isResetting: isResetting,
                              }}
                            ></InterrogationResetButton>
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

InterrogationListPage.displayName = "InterrogationListPage";
