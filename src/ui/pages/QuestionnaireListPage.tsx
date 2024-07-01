import AddCircleIcon from "@mui/icons-material/AddCircle";
import SettingsIcon from "@mui/icons-material/Settings";

import {
  Alert,
  Button,
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
import { useQueryClient } from "@tanstack/react-query";
import { Questionnaire } from "core/application/model";
import { useApiMutation } from "core/infrastructure/hooks/useApiMutation";
import { useApiQuery } from "core/infrastructure/hooks/useApiQuery";
import { memo, useState } from "react";
import { useIntl } from "react-intl";
import { Link } from "react-router-dom";
import { makeStyles } from "tss-react/mui";
import { Block, Loader, Title } from "ui/components/base";
import { SearchQuestionnaire } from "ui/components/SearchQuestionnaire";
import { ModeListComponent } from "ui/components/ModeListComponent";
import { QuestionnaireDeleteButton } from "ui/components/QuestionnaireDeleteButton";

export type QuestionnaireEditPageProps = {
  fetchQuestionnaires: () => Promise<Questionnaire[]>;
  deleteQuestionnaire: (id: number) => Promise<void>;
};

export const QuestionnaireListPage = memo(
  (props: QuestionnaireEditPageProps) => {
    const intl = useIntl();
    const { classes } = useStyles();
    const queryClient = useQueryClient();
    const { isLoading, data: questionnaires } = useApiQuery({
      queryKey: ["fetchQuestionnaires"],
      queryFn: props.fetchQuestionnaires,
    });
    const [searchTerm, setSearchTerm] = useState<string>("");

    const filteredQuestionnaires = questionnaires?.filter(
      (questionnaire) =>
        questionnaire.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        questionnaire.poguesId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const {
      mutate: deleteQuestionnaire,
      isPending: isDeleting,
      isSuccess,
    } = useApiMutation({
      mutationKey: ["questionnaire-delete"],
      mutationFn: (questionnaire: Questionnaire) =>
        props.deleteQuestionnaire(questionnaire.id),
    });

    if (isSuccess) {
      queryClient.invalidateQueries({
        queryKey: ["fetchQuestionnaires"],
      });
    }

    return (
      <Grid component="main" container justifyContent="center">
        <Grid item xs={12} md={10}>
          <Block>
            <Loader isLoading={isLoading}>
              <Title>
                {intl.formatMessage({ id: "questionnaire_list_label" })}
              </Title>
              <Stack
                direction="row"
                justifyContent="space-between"
                className={classes.listHead}
              >
                <Stack className={classes.searchBar}>
                  <SearchQuestionnaire
                    searchTerm={searchTerm}
                    onSearchTermChange={setSearchTerm}
                  />
                </Stack>
                <Link to={`/questionnaires/check`}>
                  <Button
                    color="info"
                    variant="contained"
                    startIcon={<AddCircleIcon />}
                    className={classes.btnAdd}
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
                      {filteredQuestionnaires?.map((questionnaire) => (
                        <TableRow key={questionnaire.id}>
                          <TableCell component="th" scope="row">
                            {questionnaire.poguesId}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {questionnaire.label}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {questionnaire.isSynchronized ? (
                              <ModeListComponent
                                questionnaire={questionnaire}
                              />
                            ) : (
                              <Alert severity="error">
                                {intl.formatMessage({
                                  id: "questionnaire_list_synchronisation",
                                })}
                              </Alert>
                            )}
                          </TableCell>
                          <TableCell align="center">
                            <Link
                              to={`/questionnaires/${questionnaire.id}/edit`}
                            >
                              <IconButton aria-label="edit">
                                <SettingsIcon
                                  color={
                                    questionnaire.isSynchronized
                                      ? "inherit"
                                      : "error"
                                  }
                                />
                              </IconButton>
                            </Link>
                            <QuestionnaireDeleteButton
                              questionnaire={questionnaire}
                              mutateDelete={{
                                deleteQuestionnaire: deleteQuestionnaire,
                                isDeleting: isDeleting,
                              }}
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
  listHead: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  searchBar: {
    minWidth: "40%",
  },
  btnAdd: {
    height: "100%",
  },
}));

QuestionnaireListPage.displayName = "QuestionnaireListPage";
