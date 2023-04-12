import GetAppIcon from "@mui/icons-material/GetApp";
import LoadingButton from "@mui/lab/LoadingButton";
import { Box, Grid, Stack, TextField } from "@mui/material";
import { Questionnaire } from "core/application/model";
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

    useEffect(() => {
      if (poguesId !== undefined) {
        setPoguesIdInput(poguesId);
        getQuestionnaireFromPogues();
        return;
      }
      setLoading(false);
    }, []);

    const {
      refetch: getQuestionnaireFromPogues,
      isLoading: isLoadingQuestionnaire,
    } = useApiQuery(
      ["questionnaire", poguesIdInput],
      () => {
        return props.fetchQuestionnaireFromPoguesId(poguesIdInput);
      },
      {
        enabled: false,
        notify: false,
        // go to the update page if questionnaire already exists
        onSuccess: (questionnaire: Questionnaire) => {
          navigate(`/questionnaires/${questionnaire.id}`);
        },
        // get pogues questionnaire if questionnaire in db does not exist
        onError: () => {
          getPoguesQuestionnaire({});
        },
      }
    );

    const {
      refetch: getPoguesQuestionnaire,
      isLoading: isLoadingPoguesQuestionnaire,
    } = useApiQuery(
      ["questionnaire-", poguesIdInput],
      () => {
        return props.fetchPoguesQuestionnaire(poguesIdInput);
      },
      {
        enabled: false,
        successMessage: intl.formatMessage({
          id: "questionnaire_retrieve_success",
        }),
        onSuccess(questionnaireData) {
          navigate("/questionnaires/add", { state: questionnaireData });
          return;
        },
        onError() {
          setLoading(false);
        },
      }
    );

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
