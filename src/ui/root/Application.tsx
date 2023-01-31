import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { memo, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { makeStyles } from "tss-react/mui";
import { Footer, Header, SidebarNav } from "ui/components/base";
import {
  ErrorPage,
  QuestionnaireAddPage,
  QuestionnaireCheckPoguesIdPage,
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
                element={<QuestionnaireListPage />}
              />
              <Route
                path="/questionnaires/:id"
                element={<QuestionnaireEditPage />}
              />
              <Route
                path="/questionnaires/check"
                element={<QuestionnaireCheckPoguesIdPage />}
              >
                <Route
                  path="/questionnaires/check/:poguesId"
                  element={<QuestionnaireCheckPoguesIdPage />}
                />
              </Route>
              <Route
                path="/questionnaires/add"
                element={<QuestionnaireAddPage />}
              ></Route>
              <Route
                path="/questionnaires/:questionnaireId/modes/:modeName"
                element={<SurveyUnitListPage />}
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
