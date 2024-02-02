import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import {
  createQuestionnaireRepository,
  createSurveyUnitRepository,
} from "core/infrastructure";
import { useAuth } from "core/infrastructure/hooks/useAuth";
import { getEnvVar } from "core/utils/configuration/env";
import { memo, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { makeStyles } from "tss-react/mui";
import { Footer, Header, SidebarNav } from "ui/components/base";
import {
  ErrorPage,
  QuestionnaireAddPage,
  QuestionnaireCheckPoguesIdPage,
  QuestionnaireDetailsPage,
  QuestionnaireEditPage,
  QuestionnaireListPage,
} from "ui/pages";
import { SurveyUnitListPage } from "ui/pages/SurveyUnitListPage";

export const Application = memo(() => {
  const { classes } = useStyles();
  const [open, setOpen] = useState<boolean>(false);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const {
    oidc: { isUserLoggedIn, login, oidcTokens },
  } = useAuth();

  if (!isUserLoggedIn && login) {
    login({
      doesCurrentHrefRequiresAuth: true,
    });
    return <></>;
  }

  const questionnaireRepository = createQuestionnaireRepository(
    getEnvVar("VITE_API_URL"),
    oidcTokens?.accessToken
  );
  const surveyUnitRepository = createSurveyUnitRepository(
    getEnvVar("VITE_API_URL"),
    oidcTokens?.accessToken
  );

  return (
    <>
      <Header open={open} toggleDrawer={toggleDrawer} />
      <BrowserRouter>
        <Box className={classes.horizontalContainer}>
          <SidebarNav open={open} toggleDrawer={toggleDrawer} />
          <Container maxWidth="lg" className={classes.container}>
            <Routes>
              <Route path="/" element={<Navigate to="/questionnaires" />} />
              <Route
                path="/questionnaires"
                element={
                  <QuestionnaireListPage
                    fetchQuestionnaires={
                      questionnaireRepository.getQuestionnaires
                    }
                    deleteQuestionnaire={
                      questionnaireRepository.deleteQuestionnaire
                    }
                  />
                }
              />
              <Route
                path="/questionnaires/:id/edit"
                element={
                  <QuestionnaireEditPage
                    fetchQuestionnaire={
                      questionnaireRepository.getQuestionnaire
                    }
                    fetchSurveyContexts={
                      questionnaireRepository.getSurveyContexts
                    }
                    editQuestionnaire={
                      questionnaireRepository.editQuestionnaire
                    }
                    checkSurveyUnitsCsvData={
                      surveyUnitRepository.checkSurveyUnitsCSV
                    }
                    getSurveyUnitsSchemaCSV={
                      surveyUnitRepository.getSurveyUnitsSchemaCSV
                    }
                    getExistingSurveyUnitsSchemaCSV={
                      surveyUnitRepository.getExistingSurveyUnitsSchemaCSV
                    }
                  />
                }
              />
              <Route
                path="/questionnaires/:id"
                element={
                  <QuestionnaireDetailsPage
                    fetchQuestionnaire={
                      questionnaireRepository.getQuestionnaire
                    }
                    deleteQuestionnaire={
                      questionnaireRepository.deleteQuestionnaire
                    }
                  />
                }
              />
              <Route
                path="/questionnaires/check"
                element={
                  <QuestionnaireCheckPoguesIdPage
                    fetchPoguesQuestionnaire={
                      questionnaireRepository.getPoguesQuestionnaire
                    }
                    fetchQuestionnaireFromPoguesId={
                      questionnaireRepository.getQuestionnaireFromPoguesId
                    }
                  />
                }
              >
                <Route
                  path="/questionnaires/check/:poguesId"
                  element={
                    <QuestionnaireCheckPoguesIdPage
                      fetchPoguesQuestionnaire={
                        questionnaireRepository.getPoguesQuestionnaire
                      }
                      fetchQuestionnaireFromPoguesId={
                        questionnaireRepository.getQuestionnaireFromPoguesId
                      }
                    />
                  }
                />
              </Route>
              <Route
                path="/questionnaires/add"
                element={
                  <QuestionnaireAddPage
                    fetchSurveyContexts={
                      questionnaireRepository.getSurveyContexts
                    }
                    fetchQuestionnaireFromPoguesId={
                      questionnaireRepository.getQuestionnaireFromPoguesId
                    }
                    addQuestionnaire={questionnaireRepository.addQuestionnaire}
                    checkSurveyUnitsCsvData={
                      surveyUnitRepository.checkSurveyUnitsCSV
                    }
                    getSurveyUnitsSchemaCSV={
                      surveyUnitRepository.getSurveyUnitsSchemaCSV
                    }
                    getExistingSurveyUnitsSchemaCSV={
                      surveyUnitRepository.getExistingSurveyUnitsSchemaCSV
                    }
                  />
                }
              ></Route>
              <Route
                path="/questionnaires/:questionnaireId/modes/:modeName"
                element={
                  <SurveyUnitListPage
                    fetchSurveyUnitsData={
                      surveyUnitRepository.getSurveyUnitsData
                    }
                    fetchQuestionnaire={
                      questionnaireRepository.getQuestionnaire
                    }
                    resetSurveyUnit={surveyUnitRepository.resetSurveyUnit}
                  />
                }
              />
              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </Container>
        </Box>
      </BrowserRouter>
      <Footer />
    </>
  );
});

const useStyles = makeStyles()((theme) => ({
  container: {
    marginTop: theme.spacing(11),
    marginBottom: theme.spacing(5),
    flexGrow: "1",
  },
  horizontalContainer: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#E1E8EF",
  },
}));

Application.displayName = "Application";
