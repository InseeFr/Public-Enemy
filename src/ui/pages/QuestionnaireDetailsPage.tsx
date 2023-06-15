import LaunchIcon from "@mui/icons-material/Launch";
import SettingsIcon from "@mui/icons-material/Settings";
import { Grid, IconButton, Stack, Typography } from "@mui/material";
import { Questionnaire } from "core/application/model";
import { useApiMutation } from "core/infrastructure/hooks/useApiMutation";
import { useApiQuery } from "core/infrastructure/hooks/useApiQuery";
import { getEnvVar } from "core/utils/configuration/env";
import { memo } from "react";
import { useIntl } from "react-intl";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Block, Loader, Subtitle, Title } from "ui/components/base";
import { ModeListComponent } from "ui/components/ModeListComponent";
import { QuestionnaireDeleteButton } from "ui/components/QuestionnaireDeleteButton";

export type QuestionnaireDetailsPageProps = {
  fetchQuestionnaire: (id: number) => Promise<Questionnaire>;
  deleteQuestionnaire: (id: number) => Promise<void>;
};

export const QuestionnaireDetailsPage = memo(
  (props: QuestionnaireDetailsPageProps) => {
    const { id } = useParams();
    const intl = useIntl();
    const navigate = useNavigate();
    const poguesUrl = getEnvVar("VITE_POGUES_URL");

    const { isLoading, data: questionnaire } = useApiQuery(
      ["questionnaire", id],
      () => {
        const idNumber = Number(id);
        return props.fetchQuestionnaire(idNumber);
      },
      {
        // go to the update page if questionnaire is not synchronized
        onSuccess: (questionnaire: Questionnaire) => {
          if (!questionnaire.isSynchronized) {
            navigate(`/questionnaires/${questionnaire.id}/edit`);
          }
        },
      }
    );

    const { mutate: deleteQuestionnaire, isLoading: isDeleting } =
      useApiMutation(
        (questionnaire: Questionnaire) =>
          props.deleteQuestionnaire(questionnaire.id),
        {
          onSuccess: () => {
            navigate("/questionnaires");
          },
        }
      );

    return (
      <>
        <Grid component="main" container justifyContent="center" spacing={3}>
          <Grid item xs={12} md={8}>
            <Block>
              {questionnaire ? (
                <>
                  <Title>{questionnaire.label}</Title>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" gutterBottom>
                      {intl.formatMessage({
                        id: "questionnaire_id",
                      })}
                      : {questionnaire.poguesId}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" gutterBottom>
                      {intl.formatMessage({
                        id: "questionnaire_context",
                      })}
                      : {questionnaire.context.value}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" gutterBottom>
                      <a
                        href={`${poguesUrl}/questionnaire/${questionnaire.poguesId}`}
                      >
                        {intl.formatMessage({
                          id: "questionnaire_pogues",
                        })}
                        <LaunchIcon fontSize="inherit"></LaunchIcon>
                      </a>
                    </Typography>
                  </Grid>
                  <Subtitle>
                    {intl.formatMessage({
                      id: "questionnaire_survey_units",
                    })}
                  </Subtitle>
                  <Stack direction="row" justifyContent="begin">
                    <ModeListComponent questionnaire={questionnaire} />
                  </Stack>
                  <Stack direction="row" justifyContent="end">
                    <Link to={`/questionnaires/${questionnaire.id}/edit`}>
                      <IconButton aria-label="edit">
                        <SettingsIcon />
                      </IconButton>
                    </Link>
                    <QuestionnaireDeleteButton
                      questionnaire={questionnaire}
                      mutateDelete={{
                        deleteQuestionnaire: deleteQuestionnaire,
                        isDeleting: isDeleting,
                      }}
                    />
                  </Stack>
                </>
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

QuestionnaireDetailsPage.displayName = "QuestionnaireDetailsPage";
