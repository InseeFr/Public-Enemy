import { Questionnaire, SurveyContext } from 'core/application/model'
import { QuestionnaireRepositoryPort } from 'core/application/port'
import { deleteRequest, getRequest } from 'core/utils/http'
import { postRequestMultiPart } from 'core/utils/http/fetcher'

/**
 * Get Questionnaire Repository
 * @param apiUrl questionnaire CRUD API URL
 * @returns questionnaire repository
 */
export function createQuestionnaireRepository(
  apiUrl: string,
  token?: string,
): QuestionnaireRepositoryPort {
  const getQuestionnaires = (): Promise<Questionnaire[]> => {
    return getRequest<Questionnaire[]>(`${apiUrl}/questionnaires`)(token)
  }

  const getQuestionnaire = (id: number): Promise<Questionnaire> => {
    return getRequest<Questionnaire>(`${apiUrl}/questionnaires/${id}`)(token)
  }

  /**
   * get questionnaire filled with pogues informations (not the db one)
   */
  const getPoguesQuestionnaire = (poguesId: string): Promise<Questionnaire> => {
    return getRequest<Questionnaire>(
      `${apiUrl}/questionnaires/pogues/${poguesId}`,
    )(token)
  }

  /**
   * get questionnaire from pogues id (the db one)
   */
  const getQuestionnaireFromPoguesId = (
    poguesId?: string,
  ): Promise<Questionnaire> => {
    return getRequest<Questionnaire>(`${apiUrl}/questionnaires/${poguesId}/db`)(
      token,
    )
  }

  const addQuestionnaire = (
    questionnaire: Questionnaire,
  ): Promise<Questionnaire> => {
    const formData = new FormData()
    const questionnaireRest = {
      poguesId: questionnaire.poguesId,
      context: questionnaire.context,
    }
    formData.append('questionnaire', JSON.stringify(questionnaireRest))

    if (questionnaire.surveyUnitData) {
      formData.append('surveyUnitData', questionnaire.surveyUnitData)
    }

    return postRequestMultiPart<Questionnaire>(
      `${apiUrl}/questionnaires/add`,
      formData,
    )(token)
  }

  const editQuestionnaire = (
    questionnaire: Questionnaire,
  ): Promise<Questionnaire> => {
    const formData = new FormData()
    formData.append('context', JSON.stringify(questionnaire.context))

    if (questionnaire.surveyUnitData) {
      formData.append('surveyUnitData', questionnaire.surveyUnitData)
    }

    return postRequestMultiPart<Questionnaire>(
      `${apiUrl}/questionnaires/${questionnaire.id}`,
      formData,
    )(token)
  }

  const deleteQuestionnaire = (id: number): Promise<void> => {
    return deleteRequest<void>(`${apiUrl}/questionnaires/${id}/delete`)(token)
  }

  const getSurveyContexts = (): Promise<SurveyContext[]> => {
    return getRequest<SurveyContext[]>(`${apiUrl}/contexts`)(token)
  }

  return {
    getQuestionnaires,
    getQuestionnaire,
    getQuestionnaireFromPoguesId,
    getPoguesQuestionnaire,
    addQuestionnaire,
    deleteQuestionnaire,
    editQuestionnaire,
    getSurveyContexts,
  }
}
