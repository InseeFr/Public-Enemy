import AddCircleIcon from "@mui/icons-material/AddCircle";
import CallIcon from "@mui/icons-material/Call";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import SettingsIcon from "@mui/icons-material/Settings";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import WebIcon from "@mui/icons-material/Web";

import {
  Button,
  Chip,
  Grid,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Mode, Questionnaire } from "core/application/model";
import { useApiQuery } from "core/infrastructure/hooks/useApiQuery";
import React, { memo } from "react";
import { useIntl } from "react-intl";
import { Link } from "react-router-dom";
import { makeStyles } from "tss-react/mui";
import { Block, Loader, Title } from "ui/components/base";
import { QuestionnaireDelete } from "ui/components/QuestionnaireDelete";

export type QuestionnaireEditPageProps = {
  fetchQuestionnaires: () => Promise<Questionnaire[]>;
  deleteQuestionnaire: (id: number) => Promise<void>;
};

export const QuestionnaireListPage = memo(
  (props: QuestionnaireEditPageProps) => {
    const intl = useIntl();
    const { classes } = useStyles();
    const { isLoading, data: questionnaires } = useApiQuery(
      "fetchQuestionnaires",
      props.fetchQuestionnaires
    );

    const getIcon = (mode: Mode): JSX.Element => {
      switch (mode.name) {
        case "CAPI":
          return <SupervisedUserCircleIcon />;
        case "PAPI":
          return <PictureAsPdfIcon />;
        case "CAWI":
          return <WebIcon />;
        case "CATI":
          return <CallIcon />;
        default:
          return <WebIcon />;
      }
    };

    const getVisiblesModes = (questionnaire: Questionnaire): Mode[] => {
      return questionnaire?.modes?.filter((mode) => mode.isWebMode);
    };

    return (
      <Grid component="main" container justifyContent="center">
        <Grid item xs={12} md={10}>
          <Block>
            <Loader isLoading={isLoading}>
              <Title>
                {intl.formatMessage({ id: "questionnaire_list_label" })}
              </Title>
              <Stack direction="row" justifyContent="end">
                <Link to={`/questionnaires/check`} className={classes.btnAdd}>
                  <Button
                    color="info"
                    variant="contained"
                    startIcon={<AddCircleIcon />}
                  >
                    {intl.formatMessage({ id: "questionnaire_list_btn_add" })}
                  </Button>
                </Link>
              </Stack>
              <TableContainer component={Paper}>
                <Table aria-label="questionnaire table">
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        {intl.formatMessage({
                          id: "questionnaire_id",
                        })}
                      </TableCell>
                      <TableCell>
                        {intl.formatMessage({
                          id: "questionnaire_name",
                        })}
                      </TableCell>
                      <TableCell>
                        {intl.formatMessage({
                          id: "questionnaire_mode",
                        })}
                      </TableCell>
                      <TableCell align="center">
                        {intl.formatMessage({
                          id: "questionnaire_list_actions",
                        })}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  {
                    <TableBody>
                      {questionnaires?.map((questionnaire) => (
                        <TableRow key={questionnaire.id}>
                          <TableCell component="th" scope="row">
                            {questionnaire.poguesId}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {questionnaire.label}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {getVisiblesModes(questionnaire).map((mode) => (
                              <React.Fragment
                                key={`${questionnaire.id}-${mode.name}`}
                              >
                                <Link
                                  to={`/questionnaires/${questionnaire.id}/modes/${mode.name}`}
                                >
                                  <Chip
                                    icon={getIcon(mode)}
                                    label={mode.name}
                                    className={classes.btnMode}
                                  />
                                </Link>{" "}
                              </React.Fragment>
                            ))}
                          </TableCell>
                          <TableCell align="center">
                            <Link to={`/questionnaires/${questionnaire.id}`}>
                              <IconButton aria-label="edit">
                                <SettingsIcon />
                              </IconButton>
                            </Link>
                            <QuestionnaireDelete
                              questionnaire={questionnaire}
                              deleteQuestionnaire={props.deleteQuestionnaire}
                            />
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
  }
);

const useStyles = makeStyles()((theme) => ({
  btnAdd: {
    marginBottom: theme.spacing(2),
  },
  btnMode: {
    cursor: "pointer",
  },
}));

QuestionnaireListPage.displayName = "QuestionnaireListPage";
