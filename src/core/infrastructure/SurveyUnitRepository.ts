import { SurveyUnitsData, SurveyUnitsMessages } from "core/application/model";
import { SurveyUnitRepositoryPort } from "core/application/port";
import { getRequest } from "core/utils/http";
import {
  fetcherFile,
  postRequestMultiPart,
  putRequest,
} from "core/utils/http/fetcher";

/**
 * Get SurveyUnit Repository
 * @param apiUrl surveyUnit CRUD API URL
 * @returns surveyUnit repository
 */
export function createSurveyUnitRepository(
  apiUrl: string,
  token?: string
): SurveyUnitRepositoryPort {
  const getSurveyUnitsData = (
    questionnaireId: number,
    modeName: string
  ): Promise<SurveyUnitsData> => {
    return getRequest<SurveyUnitsData>(
      `${apiUrl}/questionnaires/${questionnaireId}/modes/${modeName}/survey-units`
    )(token);
  };

  const checkSurveyUnitsCSV = (
    poguesId: string,
    surveyUnitCSVData: File
  ): Promise<SurveyUnitsMessages> => {
    const formData = new FormData();
    formData.append("surveyUnitData", surveyUnitCSVData);

    return postRequestMultiPart<SurveyUnitsMessages>(
      `${apiUrl}/questionnaires/${poguesId}/checkdata`,
      formData
    )(token);
  };
  const resetSurveyUnit = (surveyUnitId: string): Promise<void> => {
    return putRequest<void>(
      `${apiUrl}/survey-units/${surveyUnitId}/reset`,
      undefined
    )(token);
  };

  const getSurveyUnitsSchemaCSV = (poguesId: string): Promise<void> => {
    return fetcherFile(`${apiUrl}/questionnaires/${poguesId}/csv`, token);
  };

  const getExistingSurveyUnitsSchemaCSV = (id: number): Promise<void> => {
    return fetcherFile(`${apiUrl}/questionnaires/${id}/data`, token);
  };

  return {
    getSurveyUnitsData,
    checkSurveyUnitsCSV,
    resetSurveyUnit,
    getSurveyUnitsSchemaCSV,
    getExistingSurveyUnitsSchemaCSV,
  };
}
