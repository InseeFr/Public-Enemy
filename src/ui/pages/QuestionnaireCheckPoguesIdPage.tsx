import * as React from 'react'
import { memo, useEffect, useState } from 'react'

import GetAppIcon from '@mui/icons-material/GetApp'
import LoadingButton from '@mui/lab/LoadingButton'
import { Box, Grid, Stack, TextField } from '@mui/material'
import type { Questionnaire } from 'core/application/model'
import { useNotifier } from 'core/infrastructure'
import { useCustomQuery } from 'core/infrastructure/hooks/useCustomQuery'
import { useIntl } from 'react-intl'
import { useNavigate, useParams } from 'react-router-dom'
import { Block, Loader, Title } from 'ui/components/base'

export const QuestionnaireCheckPoguesIdPage = memo(
  (props: {
    fetchPoguesQuestionnaire: (poguesId: string) => Promise<Questionnaire>
    fetchQuestionnaireFromPoguesId: (poguesId: string) => Promise<Questionnaire>
  }) => {
    const { poguesId } = useParams<string>()
    const navigate = useNavigate()
    const intl = useIntl()
    const [poguesIdInput, setPoguesIdInput] = useState(poguesId ?? '')
    const [isLoading, setLoading] = useState(true)
    const notifier = useNotifier()

    const {
      launch,
      firstSuccess,
      secondSuccess,
      questionnairePoguesId,
      questionnairePogues,
      globalError,
      isLoadingPoguesQuestionnaire,
    } = useCustomQuery(
      props.fetchQuestionnaireFromPoguesId,
      props.fetchPoguesQuestionnaire,
      poguesIdInput,
    )

    useEffect(() => {
      if (poguesId !== undefined) {
        setPoguesIdInput(poguesId)
        launch()
        return
      }
      setLoading(false)
    }, [])

    if (secondSuccess && questionnairePogues) {
      notifier.success(
        intl.formatMessage({
          id: 'questionnaire_retrieve_success',
        }),
      )
      navigate('/questionnaires/add', { state: questionnairePogues })
    }
    if (globalError) {
      notifier.error(intl.formatMessage({ id: 'questionnaire_add_notfound' }))
    }

    if (firstSuccess && questionnairePoguesId) {
      navigate(`/questionnaires/${questionnairePoguesId}`)
    }

    const handlePoguesIdChange = (
      event: React.ChangeEvent<HTMLInputElement>,
    ) => {
      setPoguesIdInput(event.target.value)
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      launch()
    }

    return (
      <Loader isLoading={isLoading}>
        <Grid component="main" container justifyContent="center" spacing={3}>
          <Grid item xs={12} md={8}>
            <Block>
              <Title>
                {intl.formatMessage({ id: 'questionnaire_add_label' })}
              </Title>
              <Box component="form" onSubmit={handleSubmit}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    margin="normal"
                    label={intl.formatMessage({ id: 'questionnaire_id' })}
                    fullWidth
                    variant="outlined"
                    helperText={intl.formatMessage({
                      id: 'questionnaire_id_helper',
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
                    loading={isLoadingPoguesQuestionnaire}
                    loadingPosition="start"
                  >
                    {intl.formatMessage({ id: 'questionnaire_retrieve' })}
                  </LoadingButton>
                </Stack>
              </Box>
            </Block>
          </Grid>
        </Grid>
      </Loader>
    )
  },
)

QuestionnaireCheckPoguesIdPage.displayName = 'QuestionnaireCheckPoguesIdPage'
