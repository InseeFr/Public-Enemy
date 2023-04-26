import { SurveyUnitsData, SurveyUnitsMessages } from "core/application/model";
import { SurveyUnitRepositoryPort } from "core/application/port";
import { getRequest } from "core/utils/http";
import { postRequestMultiPart, putRequest } from "core/utils/http/fetcher";

/**
 * Get SurveyUnit Repository
 * @param apiUrl surveyUnit CRUD API URL
 * @returns surveyUnit repository
 */
export function createSurveyUnitRepository(
  apiUrl: string
): SurveyUnitRepositoryPort {
  const getSurveyUnitsData = (
    questionnaireId: number,
    modeName: string
  ): Promise<SurveyUnitsData> => {
    return getRequest<SurveyUnitsData>(
      `${apiUrl}/questionnaires/${questionnaireId}/modes/${modeName}/survey-units`
    );
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
    );
  };

  const resetSurveyUnit = (surveyUnitId: string): Promise<void> => {
    return putRequest<void>(
      `${apiUrl}/survey-units/${surveyUnitId}/reset`,
      undefined
    );
  };

  return {
    getSurveyUnitsData,
    checkSurveyUnitsCSV,
    resetSurveyUnit,
  };
}
