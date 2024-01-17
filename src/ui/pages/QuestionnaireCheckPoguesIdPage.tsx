import GetAppIcon from "@mui/icons-material/GetApp";
import LoadingButton from "@mui/lab/LoadingButton";
import { Box, Grid, Stack, TextField } from "@mui/material";
import { Questionnaire } from "core/application/model";
import { useNotifier } from "core/infrastructure";
import { useApiQuery } from "core/infrastructure/hooks/useApiQuery";
import * as React from "react";
import { memo, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useNavigate, useParams } from "react-router-dom";
import { Block, Loader, Title } from "ui/components/base";

export const QuestionnaireCheckPoguesIdPage = memo(
  (props: {
    fetchPoguesQuestionnaire: (poguesId: string) => Promise<Questionnaire>;
    fetchQuestionnaireFromPoguesId: (
      poguesId: string
    ) => Promise<Questionnaire>;
  }) => {
    const { poguesId } = useParams<string>();
    const navigate = useNavigate();
    const intl = useIntl();
    const [poguesIdInput, setPoguesIdInput] = useState(poguesId ?? "");
    const [isLoading, setLoading] = useState(true);
    const notifier = useNotifier();

    useEffect(() => {
      if (poguesId !== undefined) {
        setPoguesIdInput(poguesId);
        getQuestionnaireFromPogues();
        return;
      }
      setLoading(false);
    }, []);

    const {
      refetch: getPoguesQuestionnaire,
      isLoading: isLoadingPoguesQuestionnaire,
      isSuccess: isSuccessPoguesQuestionnaire,
      isError: isErrorPoguesQuestionnaire,
      data: poguesQuestionnaire,
    } = useApiQuery({
      queryKey: ["questionnaire-", poguesIdInput],
      queryFn: () => {
        console.log("Let's fetch from ogues !!!");
        return props.fetchPoguesQuestionnaire(poguesIdInput);
      },
      options: {
        enabled: false,
        notifyOnChangeProps: ["data"],
        // successMessage: intl.formatMessage({
        //   id: "questionnaire_retrieve_success",
        // }),
        // onSuccess(questionnaireData) {
        //   navigate("/questionnaires/add", { state: questionnaireData });
        // },
        // onError() {
        //   setLoading(false);
        // },
      },
    });

    if (isSuccessPoguesQuestionnaire && poguesQuestionnaire) {
      notifier.success(
        intl.formatMessage({
          id: "questionnaire_retrieve_success",
        })
      );
      console.log("poguesQuestionnaire", poguesQuestionnaire);
      navigate("/questionnaires/add", { state: poguesQuestionnaire });
    }
    if (isErrorPoguesQuestionnaire) {
      setLoading(false);
    }

    const {
      refetch: getQuestionnaireFromPogues,
      isLoading: isLoadingQuestionnaire,
      isSuccess: isSuccessQuestionnaireFromPogues,
      isError: isErrorQuestionnaireFromPogues,
      data: questionnaireFromPogues,
    } = useApiQuery({
      queryKey: ["questionnaire", poguesIdInput],
      queryFn: () => {
        console.log("Let's fetched ! ");
        return props.fetchQuestionnaireFromPoguesId(poguesIdInput);
      },
      options: {
        enabled: false,
        // notifyOnChangeProps: [],
        // go to the details page if questionnaire already exists
        // onSuccess: (questionnaire: Questionnaire) => {
        //   navigate(`/questionnaires/${questionnaire.id}`);
        // },
        // // get pogues questionnaire if questionnaire in db does not exist
        // onError: () => {
        //   getPoguesQuestionnaire({});
        // },
      },
    });

    if (isSuccessQuestionnaireFromPogues && questionnaireFromPogues) {
      navigate(`/questionnaires/${questionnaireFromPogues.id}`);
    }
    if (isErrorQuestionnaireFromPogues) {
      // get pogues questionnaire if questionnaire in db does not exist
      console.log("Let'sgo, not questionnaire inPublic-enemy db");
      getPoguesQuestionnaire({});
    }

    const handlePoguesIdChange = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      setPoguesIdInput(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      getQuestionnaireFromPogues();
    };

    return (
      <Loader isLoading={isLoading}>
        <Grid component="main" container justifyContent="center" spacing={3}>
          <Grid item xs={12} md={8}>
            <Block>
              <Title>
                {intl.formatMessage({ id: "questionnaire_add_label" })}
              </Title>
              <Box component="form" onSubmit={handleSubmit}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    margin="normal"
                    label={intl.formatMessage({ id: "questionnaire_id" })}
                    fullWidth
                    variant="outlined"
                    helperText={intl.formatMessage({
                      id: "questionnaire_id_helper",
                    })}
                    value={poguesIdInput}
                    onChange={handlePoguesIdChange}
                  />
                </Grid>

                <Stack direction="row" justifyContent="center">
                  <LoadingButton
                    type="submit"
                    color="info"
                    variant="contained"
                    startIcon={<GetAppIcon />}
                    loading={
                      isLoadingPoguesQuestionnaire || isLoadingQuestionnaire
                    }
                    loadingPosition="start"
                  >
                    {intl.formatMessage({ id: "questionnaire_retrieve" })}
                  </LoadingButton>
                </Stack>
              </Box>
            </Block>
          </Grid>
        </Grid>
      </Loader>
    );
  }
);

QuestionnaireCheckPoguesIdPage.displayName = "QuestionnaireCheckPoguesIdPage";
