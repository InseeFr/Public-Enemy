import SaveIcon from "@mui/icons-material/Save";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  Input,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Questionnaire, SurveyContext } from "core/application/model";
import { makeQuestionnaireUseCase } from "core/factory";
import { useNotifier } from "core/infrastructure";
import * as React from "react";
import { memo, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "tss-react/mui";
import { ConfirmationDialog, Loader, Title } from "./base";

export type QuestionnaireEditFormProps = {
  questionnaire: Questionnaire;
  isEditMode: boolean;
};

export const QuestionnaireEditForm = memo(
  (props: QuestionnaireEditFormProps) => {
    const [questionnaire, setQuestionnaire] = useState<Questionnaire>({
      ...props.questionnaire,
    });
    const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
    const [surveyContexts, setSurveyContexts] = useState<SurveyContext[]>();
    const notifier = useNotifier();
    const questionnaireUseCase = makeQuestionnaireUseCase();
    const navigate = useNavigate();
    const intl = useIntl();
    const [isLoading, setLoading] = useState(true);
    const [isSubmitting, setSubmitting] = useState(false);
    const { classes } = useStyles();
    const [errorContextInput, setErrorContextInput] = useState("");
    const [errorSurveyUnitDataInput, setErrorSurveyUnitDataInput] =
      useState("");
    const [hasErrors, setHasErrors] = useState<boolean>(false);

    /**
     * Load contexts on mount
     */
    useEffect(() => {
      setLoading(true);
      questionnaireUseCase.getSurveyContexts().then((surveyContextsData) => {
        setSurveyContexts(surveyContextsData);
        setLoading(false);
      });
    }, []);

    /**
     * Check validation on data change
     */
    useEffect(() => {
      if (questionnaire.surveyUnitData) {
        validateSurveyUnitDataField();
      }
    }, [questionnaire.surveyUnitData]);

    /**
     * Check validation on context change
     */
    useEffect(() => {
      if (questionnaire.context) {
        validateSurveyContextField();
      }
    }, [questionnaire.context]);

    /**
     * Event triggered when context field change
     * @param event
     */
    const handleContextChange = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      setQuestionnaire({
        ...questionnaire,
        context: {
          ...questionnaire.context,
          name: event.target.value,
        },
      });
    };

    /**
     * Event triggered when survey unit data field change
     * @param event
     */
    const handleSurveyUnitDataChange = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      const fileList = event.target.files;
      if (!fileList) {
        setErrorSurveyUnitDataInput(
          intl.formatMessage({
            id: "questionnaire_edit_data_notfound",
          })
        );
        return;
      }
      setQuestionnaire((state) => ({
        ...state,
        surveyUnitData: fileList[0],
      }));
    };

    /**
     * validate context field
     * @returns true if context field is valid, false otherwise
     */
    const validateSurveyContextField = (): boolean => {
      if (questionnaire.context.name) {
        setErrorContextInput("");
        return true;
      }

      setErrorContextInput(
        intl.formatMessage({
          id: "questionnaire_edit_context_notfound",
        })
      );
      return false;
    };

    /**
     * validate survey unit data field
     * @returns true if data field is valid, false otherwise
     */
    const validateSurveyUnitDataField = (): boolean => {
      if (questionnaire.surveyUnitData) {
        setErrorSurveyUnitDataInput("");
        return true;
      }

      setErrorSurveyUnitDataInput(
        intl.formatMessage({
          id: "questionnaire_edit_data_notfound",
        })
      );
      return false;
    };

    /**
     * Handle form validation
     * @returns true if form is valid, false otherwise
     */
    const validateForm = (): boolean => {
      const isSurveyContextValid = validateSurveyContextField();
      const isDataValid = validateSurveyUnitDataField();
      const isValid = isSurveyContextValid && isDataValid;
      setHasErrors(!isValid);
      return isValid;
    };

    /**
     * Handle new questionnaire save when submit event is triggered
     * @param event
     */
    const handleAddQuestionnaireSubmit = (
      event: React.FormEvent<HTMLFormElement>
    ) => {
      event.preventDefault();
      validateForm() &&
        saveQuestionnaire(questionnaireUseCase.addQuestionnaire);
    };

    /**
     * handle confirmation dialog when submit event is triggered on questionnaire update
     * @param event
     */
    const handleEditQuestionnaireSubmit = (
      event: React.FormEvent<HTMLFormElement>
    ) => {
      event.preventDefault();
      validateForm() && setOpenConfirmationDialog(true);
    };

    /**
     * handle questionnaire update when confirmation dialog is agreed
     */
    const handleSaveEditQuestionnaire = () => {
      setOpenConfirmationDialog(false);
      saveQuestionnaire(questionnaireUseCase.editQuestionnaire);
    };

    /**
     * Save questionnaire
     * @param saveAction save action method
     */
    const saveQuestionnaire = (
      saveAction: (questionnaire: Questionnaire) => Promise<Questionnaire>
    ) => {
      setHasErrors(false);
      setErrorContextInput("");
      setErrorSurveyUnitDataInput("");

      setSubmitting(true);

      saveAction(questionnaire)
        .then(() => {
          notifier.success(
            intl.formatMessage({ id: "questionnaire_edit_success" })
          );
          navigate("/questionnaires");
        })
        .catch((err) => {
          notifier.error(intl.formatMessage({ id: "error_request_failed" }));
          console.log(err);
        })
        .finally(() => {
          setSubmitting(false);
        });
    };

    return (
      <Loader isLoading={isLoading}>
        <Title>{questionnaire.label}</Title>
        <Box
          component="form"
          onSubmit={
            props.isEditMode
              ? handleEditQuestionnaireSubmit
              : handleAddQuestionnaireSubmit
          }
        >
          {hasErrors && (
            <Grid item xs={12}>
              <Alert severity="error">
                {intl.formatMessage({ id: "questionnaire_edit_errors" })}
              </Alert>
            </Grid>
          )}
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
                id: "questionnaire_mode",
              })}
              :{" "}
              {questionnaire.modes.map((mode) => (
                <span key={`${mode.name}-${questionnaire.id}`}>
                  {mode.name}{" "}
                </span>
              ))}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={3}>
            <FormControl
              className={classes.vSpaceSelect}
              fullWidth
              size="small"
            >
              <TextField
                id="questionnaire-context"
                select
                onChange={handleContextChange}
                error={errorContextInput ? true : false}
                value={questionnaire.context.name ?? ""}
                label={intl.formatMessage({
                  id: "questionnaire_context",
                })}
                helperText={errorContextInput}
              >
                {surveyContexts?.map((surveyContext) => (
                  <MenuItem key={surveyContext.name} value={surveyContext.name}>
                    {surveyContext.value}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl
              error={errorSurveyUnitDataInput ? true : false}
              className={classes.vSpace}
              fullWidth
              size="small"
            >
              <Button variant="contained" component="label">
                {intl.formatMessage({
                  id: "questionnaire_edit_upload",
                })}
                <Input
                  onChange={handleSurveyUnitDataChange}
                  name="surveyUnitData"
                  sx={{ display: "none" }}
                  type="file"
                />
              </Button>
              <FormHelperText>
                {errorSurveyUnitDataInput
                  ? errorSurveyUnitDataInput
                  : questionnaire.surveyUnitData?.name}
              </FormHelperText>
            </FormControl>
          </Grid>

          <Stack direction="row" justifyContent="center">
            <LoadingButton
              type="submit"
              color="info"
              variant="contained"
              startIcon={<SaveIcon />}
              loading={isSubmitting}
              loadingPosition="start"
            >
              {props.isEditMode
                ? intl.formatMessage({ id: "questionnaire_edit_save" })
                : intl.formatMessage({ id: "questionnaire_add_save" })}
            </LoadingButton>
          </Stack>
          {props.isEditMode && (
            <ConfirmationDialog
              title={intl.formatMessage({
                id: "questionnaire_edit_confirmation_label",
              })}
              body={intl.formatMessage(
                { id: "questionnaire_edit_confirmation_body" },
                { name: questionnaire.label }
              )}
              disagreeBtnLabel={intl.formatMessage({
                id: "questionnaire_edit_confirmation_disagree",
              })}
              agreeBtnLabel={intl.formatMessage({
                id: "questionnaire_edit_confirmation_agree",
              })}
              handleConfirmation={handleSaveEditQuestionnaire}
              openConfirmationDialog={openConfirmationDialog}
              setOpenConfirmationDialog={setOpenConfirmationDialog}
            />
          )}
        </Box>
      </Loader>
    );
  }
);

const useStyles = makeStyles()((theme) => ({
  vSpace: {
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(1),
  },
  vSpaceSelect: {
    marginTop: theme.spacing(1),
  },
}));

QuestionnaireEditForm.displayName = "QuestionnaireEditForm";
