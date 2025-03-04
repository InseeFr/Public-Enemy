import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { simpleQuestionnaire } from 'test/mock/questionnaire'
import { surveyContexts } from 'test/mock/surveyContext'
import { surveyUnitsWarningMessages } from 'test/mock/surveyUnitsWarningMessages'
import { notifySpy, renderWithProviders } from 'test/test-utils'
import { vi } from 'vitest'

import { QuestionnaireAddPage } from './QuestionnaireAddPage'

describe('QuestionnaireAddPage', () => {
  const addQuestionnaire = vi.fn(() => Promise.resolve(simpleQuestionnaire))
  const fetchSurveyContexts = vi.fn(() => Promise.resolve(surveyContexts))
  const fetchQuestionnaire = vi.fn(() => Promise.resolve(simpleQuestionnaire))
  const checkSurveyUnitsCsvData = vi.fn(() =>
    Promise.resolve(surveyUnitsWarningMessages),
  )
  const getSurveyUnitsSchemaCSV = vi.fn(() => Promise.resolve())
  const getExistingSurveyUnitsSchemaCSV = vi.fn(() => Promise.resolve())

  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: (
          <QuestionnaireAddPage
            addQuestionnaire={addQuestionnaire}
            fetchQuestionnaireFromPoguesId={fetchQuestionnaire}
            fetchSurveyContexts={fetchSurveyContexts}
            checkSurveyUnitsCsvData={checkSurveyUnitsCsvData}
            getSurveyUnitsSchemaCSV={getSurveyUnitsSchemaCSV}
            getExistingSurveyUnitsSchemaCSV={getExistingSurveyUnitsSchemaCSV}
          />
        ),
      },
    ],
    { initialEntries: ['/'], initialIndex: 0 },
  )

  test('should show error when no location state defined', () => {
    renderWithProviders(<RouterProvider router={router} />)
    expect(notifySpy).toHaveBeenCalledWith({
      message: 'Questionnaire inexistant',
      type: 'error',
    })
  })
})
