import { memo, useEffect, useState } from 'react'

import PreviewIcon from '@mui/icons-material/Preview'
import {
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import type { Questionnaire, SurveyUnitsData } from 'core/application/model'
import { useNotifier } from 'core/infrastructure'
import { useApiMutation } from 'core/infrastructure/hooks/useApiMutation'
import { useApiQuery } from 'core/infrastructure/hooks/useApiQuery'
import { getEnvVar } from 'core/utils/configuration/env'
import { useIntl } from 'react-intl'
import { useParams } from 'react-router-dom'
import { SurveyUnitResetButton } from 'ui/components/SurveyUnitResetButton'
import { Block, Loader, Subtitle, Title } from 'ui/components/base'

type SurveyUnitParams = {
  questionnaireId: string
  modeName: string
}

type SurveyUnitListPageProps = {
  fetchQuestionnaire: (id: number) => Promise<Questionnaire>
  fetchSurveyUnitsData: (
    id: number,
    modeName: string,
  ) => Promise<SurveyUnitsData>
  resetSurveyUnit: (surveyUnitId: string) => Promise<void>
}

export const SurveyUnitListPage = memo((props: SurveyUnitListPageProps) => {
  const intl = useIntl()
  const notifier = useNotifier()
  const orchestratorUrl = getEnvVar('VITE_ORCHESTRATOR_URL')
  const { questionnaireId, modeName } = useParams<SurveyUnitParams>()
  const [canFetchData, setCanFetchData] = useState(false)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!(questionnaireId && modeName)) {
      notifier.error(
        intl.formatMessage({ id: 'survey_unit_list_missing_parameters' }),
      )
      return
    }
    setCanFetchData(true)
  })

  const { isLoading: isQuestionnaireLoading, data: questionnaire } =
    useApiQuery({
      queryKey: ['questionnaire', questionnaireId],
      queryFn: () => {
        const idNumber = Number(questionnaireId)
        return props.fetchQuestionnaire(idNumber)
      },
      options: { enabled: canFetchData },
    })

  const { isLoading: isSurveyUnitsLoading, data: surveyUnitsData } =
    useApiQuery({
      queryKey: ['surveyUnitsData', questionnaireId, modeName],
      queryFn: () => {
        const idNumber = Number(questionnaireId)
        return props.fetchSurveyUnitsData(idNumber, modeName as string)
      },
      options: { enabled: canFetchData },
    })

  const {
    mutate: resetSurveyUnit,
    isPending: isResetting,
    isSuccess,
  } = useApiMutation({
    mutationKey: ['reset-survey-unit'],
    mutationFn: (surveyUnitId: string) => props.resetSurveyUnit(surveyUnitId),
  })

  if (isSuccess) {
    queryClient.invalidateQueries({
      queryKey: ['surveyUnitsData', questionnaireId, modeName],
    })
  }

  return (
    <Grid component="main" container justifyContent="center">
      <Grid item xs={12} md={6}>
        <Block>
          <Loader isLoading={isSurveyUnitsLoading || isQuestionnaireLoading}>
            <Title>
              {intl.formatMessage({ id: 'survey_unit_list_label' })}
            </Title>

            <Subtitle>
              <>
                {questionnaire?.label}
                <br />
                {intl.formatMessage(
                  { id: 'survey_unit_mode_label' },
                  { modeName: modeName },
                )}
              </>
            </Subtitle>

            <TableContainer component={Paper}>
              <Table aria-label="surveyUnit table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      {intl.formatMessage({
                        id: 'survey_unit_id',
                      })}
                    </TableCell>
                    <TableCell align="center">
                      {intl.formatMessage({
                        id: 'survey_unit_list_actions',
                      })}
                    </TableCell>
                  </TableRow>
                </TableHead>
                {
                  <TableBody>
                    {questionnaire &&
                      surveyUnitsData?.surveyUnits?.map((surveyUnit) => (
                        <TableRow key={surveyUnit.id}>
                          <TableCell component="th" scope="row">
                            {surveyUnit.displayableId}
                          </TableCell>
                          <TableCell align="center">
                            <a
                              target="_blank"
                              href={surveyUnit.url}
                              aria-label={intl.formatMessage(
                                { id: 'survey_unit_list_new_window' },
                                { surveyUnitId: surveyUnit.displayableId },
                              )}
                              rel="noreferrer"
                            >
                              <IconButton aria-label="edit">
                                <PreviewIcon />
                              </IconButton>
                            </a>

                            <SurveyUnitResetButton
                              surveyUnitId={surveyUnit.id}
                              mutateReset={{
                                resetSurveyUnit: resetSurveyUnit,
                                isResetting: isResetting,
                              }}
                            ></SurveyUnitResetButton>
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
  )
})

SurveyUnitListPage.displayName = 'SurveyUnitListPage'
