import GetAppIcon from "@mui/icons-material/GetApp";
import LoadingButton from "@mui/lab/LoadingButton";
import { Box, Grid, Stack, TextField } from "@mui/material";
import { Questionnaire } from "core/application/model";
import { useApiMutation } from "core/infrastructure/hooks/useApiMutation";
import * as React from "react";
import { memo, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useNavigate, useParams } from "react-router-dom";
import { Block, Loader, Title } from "ui/components/base";

export const QuestionnaireCheckPoguesIdPage = memo(
  (props: {
    fetchPoguesQuestionnaire: (poguesId: string) => Promise<Questionnaire>;
  }) => {
    const { poguesId } = useParams<string>();
    const navigate = useNavigate();
    const intl = useIntl();
    const [poguesIdInput, setPoguesIdInput] = useState("");
    const [isLoading, setLoading] = useState(true);

    const { mutate: fetchPoguesQuestionnaire, isLoading: isSubmitting } =
      useApiMutation((id: string) => props.fetchPoguesQuestionnaire(id), {
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
      });

    useEffect(() => {
      if (poguesId !== undefined) {
        setPoguesIdInput(poguesId);
        fetchPoguesQuestionnaire(poguesId);
        return;
      }
      setLoading(false);
    }, []);

    const handlePoguesIdChange = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      setPoguesIdInput(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      fetchPoguesQuestionnaire(poguesIdInput);
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
                    loading={isSubmitting}
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
