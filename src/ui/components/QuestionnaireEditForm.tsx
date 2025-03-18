import * as React from 'react'
import { memo, useEffect, useState } from 'react'

import AttachFileIcon from '@mui/icons-material/AttachFile'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import SaveIcon from '@mui/icons-material/Save'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import { LoadingButton } from '@mui/lab'
import {
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
} from '@mui/material'
import type { UseMutateFunction } from '@tanstack/react-query'
import type {
  Questionnaire,
  SurveyContext,
  SurveyUnitsMessages,
} from 'core/application/model'
import { ApiError } from 'core/application/model/error'
import useNotifier from 'core/infrastructure/Notifier'
import { useApiQuery } from 'core/infrastructure/hooks/useApiQuery'
import { useCsvChecks } from 'core/infrastructure/hooks/useCsvChecks'
import { getEnvVar } from 'core/utils/configuration/env'
import { useIntl } from 'react-intl'
import { useNavigate } from 'react-router-dom'
import { makeStyles } from 'tss-react/mui'

import { CsvAlert } from './CsvAlert'
import { ConfirmationDialog, Loader, Title } from './base'

export type QuestionnaireEditFormProps = {
  questionnaire: Questionnaire
  isEditMode: boolean
  fetchSurveyContexts: () => Promise<SurveyContext[]>
  checkSurveyUnitsCsvData: (
    poguesId: string,
    surveyUnitsCsvData: File,
  ) => Promise<SurveyUnitsMessages>
  saveQuestionnaire: UseMutateFunction<
    Questionnaire,
    ApiError,
    Questionnaire,
    unknown
  >
  isSubmitting: boolean
  getSurveyUnitsSchemaCSV: (poguesId: string) => Promise<void>
  getExistingSurveyUnitsSchemaCSV: (id: number) => Promise<void>
}

export const QuestionnaireEditForm = memo(
  (props: QuestionnaireEditFormProps) => {
    const [questionnaire, setQuestionnaire] = useState<Questionnaire>({
      ...props.questionnaire,
    })
    const [displayConfirmationDialog, setDisplayConfirmationDialog] =
      useState(false)
    const intl = useIntl()
    const [isSurveyContextValid, setSurveyContextValid] = useState(false)
    const { classes } = useStyles()
    const navigate = useNavigate()
    const apiUrl = getEnvVar('VITE_API_URL')
    const notifier = useNotifier()

    /**
     * Load contexts on mount
     */

    const { isLoading, data: surveyContexts } = useApiQuery({
      queryKey: ['fetchSurveyContexts'],
      queryFn: props.fetchSurveyContexts,
    })

    const {
      checkCsvData,
      isCheckingCsvData,
      isSuccess: isCsvDataValid,
      reset: resetChecks,
      messages,
    } = useCsvChecks(props.checkSurveyUnitsCsvData)

    useEffect(() => {
      if (!questionnaire.surveyUnitData) {
        return
      }
      resetChecks()
      checkCsvData({
        id: questionnaire.poguesId,
        data: questionnaire.surveyUnitData,
      })
    }, [questionnaire.surveyUnitData, questionnaire.poguesId])

    /**
     * Check validation on context change
     */
    useEffect(() => {
      if (!questionnaire.context) {
        setSurveyContextValid(false)
        return
      }

      if (questionnaire.context.name) {
        setSurveyContextValid(true)
      }
    }, [questionnaire.context])

    /**
     * Event triggered when context field change
     */
    const onContextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuestionnaire({
        ...questionnaire,
        context: {
          ...questionnaire.context,
          name: event.target.value,
        },
      })
    }

    /**
     * Event triggered when survey unit data field change
     */
    const onSurveyUnitDataChange = (
      event: React.ChangeEvent<HTMLInputElement>,
    ) => {
      const fileList = event.target.files
      if (!fileList) {
        return
      }

      setQuestionnaire((state) => ({
        ...state,
        surveyUnitData: fileList[0],
      }))
    }

    const submitAction = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      saveAction()
    }

    const saveAction = () => {
      props.saveQuestionnaire(questionnaire, {
        onSuccess: (questionnaire) => {
          notifier.success(
            intl.formatMessage({ id: 'questionnaire_edit_success' }),
          )
          navigate(`/questionnaires/${questionnaire.id}`)
        },
        onSettled: () => {
          closeConfirmationDialog()
        },
      })
    }

    const closeConfirmationDialog = () => {
      setDisplayConfirmationDialog(false)
    }

    const getExistingSchema = () => {
      props.getExistingSurveyUnitsSchemaCSV(questionnaire.id)
    }

    const getExpectedSchema = () => {
      props.getSurveyUnitsSchemaCSV(questionnaire.poguesId)
    }

    return (
      <Loader isLoading={isLoading}>
        <Title>{questionnaire.label}</Title>
        <Box component="form" onSubmit={submitAction}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" gutterBottom>
              {intl.formatMessage({
                id: 'questionnaire_id',
              })}
              : {questionnaire.poguesId}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="body2" gutterBottom>
              {intl.formatMessage({
                id: 'questionnaire_mode',
              })}
              :{' '}
              {questionnaire.modes.map((mode) => (
                <span key={`${mode.name}-${questionnaire.id}`}>
                  {mode.name}{' '}
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
                onChange={onContextChange}
                value={questionnaire.context.name ?? ''}
                label={intl.formatMessage({
                  id: 'questionnaire_context',
                })}
                inputProps={{
                  id: 'select-input',
                }}
              >
                {surveyContexts?.map((surveyContext) => (
                  <MenuItem key={surveyContext.name} value={surveyContext.name}>
                    {surveyContext.value}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
          </Grid>
          {messages && (
            <Grid item xs={12}>
              <CsvAlert messages={messages} />
            </Grid>
          )}

          <Grid item xs={12} sm={6}>
            <FormControl className={classes.vSpace} fullWidth size="small">
              <LoadingButton
                variant="contained"
                component="label"
                startIcon={<UploadFileIcon />}
                loading={isCheckingCsvData}
                loadingPosition="start"
              >
                {isCheckingCsvData
                  ? intl.formatMessage({
                      id: 'questionnaire_check_upload',
                    })
                  : intl.formatMessage({
                      id: 'questionnaire_edit_upload',
                    })}
                <Input
                  data-testid="upload"
                  onChange={onSurveyUnitDataChange}
                  name="surveyUnitData"
                  sx={{ display: 'none' }}
                  type="file"
                />
              </LoadingButton>
              <FormHelperText>
                {questionnaire.surveyUnitData?.name}
              </FormHelperText>
              <Typography variant="body2" gutterBottom>
                {props.isEditMode && (
                  <Button onClick={getExistingSchema}>
                    <FileDownloadIcon></FileDownloadIcon>
                    {intl.formatMessage({
                      id: 'questionnaire_edit_existing_csv',
                    })}
                  </Button>
                )}
                <Button onClick={getExpectedSchema}>
                  <AttachFileIcon></AttachFileIcon>
                  {intl.formatMessage({
                    id: 'questionnaire_schema',
                  })}
                </Button>
              </Typography>
            </FormControl>
          </Grid>

          <Stack direction="row" justifyContent="center">
            <LoadingButton
              data-testid="save-questionnaire"
              type={props.isEditMode ? 'button' : 'submit'}
              color="info"
              variant="contained"
              startIcon={<SaveIcon />}
              loading={props.isSubmitting}
              loadingPosition="start"
              disabled={
                !isSurveyContextValid || (!props.isEditMode && !isCsvDataValid)
              }
              {...(props.isEditMode && {
                onClick: () => setDisplayConfirmationDialog(true),
              })}
            >
              {props.isEditMode
                ? intl.formatMessage({ id: 'questionnaire_edit_save' })
                : intl.formatMessage({ id: 'questionnaire_add_save' })}
            </LoadingButton>
          </Stack>
          {props.isEditMode && (
            <ConfirmationDialog
              data-testid="confirmation-dialog"
              title={intl.formatMessage({
                id: 'questionnaire_edit_confirmation_label',
              })}
              body={intl.formatMessage(
                { id: 'questionnaire_edit_confirmation_body' },
                { name: questionnaire.label },
              )}
              disagreeBtn={{
                label: intl.formatMessage({
                  id: 'questionnaire_edit_confirmation_disagree',
                }),
              }}
              agreeBtn={{
                label: intl.formatMessage({
                  id: 'questionnaire_edit_confirmation_agree',
                }),
                isSubmitting: props.isSubmitting,
              }}
              handleConfirmation={saveAction}
              displayConfirmationDialog={displayConfirmationDialog}
              closeConfirmationDialog={closeConfirmationDialog}
            />
          )}
        </Box>
      </Loader>
    )
  },
)

const useStyles = makeStyles()((theme) => ({
  vSpace: {
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(1),
  },
  vSpaceSelect: {
    marginTop: theme.spacing(1),
  },
}))

QuestionnaireEditForm.displayName = 'QuestionnaireEditForm'
