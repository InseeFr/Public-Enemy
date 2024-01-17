import { SurveyUnitsData, SurveyUnitsMessages } from "core/application/model";
import { SurveyUnitRepositoryPort } from "core/application/port";
import { getRequest } from "core/utils/http";
import { postRequestMultiPart, putRequest } from "core/utils/http/fetcher";
import { useConstCallback } from "./hooks/useConstCallback";

/**
 * Get SurveyUnit Repository
 * @param apiUrl surveyUnit CRUD API URL
 * @returns surveyUnit repository
 */
export function createSurveyUnitRepository(
  apiUrl: string,
  token?: string
): SurveyUnitRepositoryPort {
  const getSurveyUnitsData = useConstCallback(
    (questionnaireId: number, modeName: string): Promise<SurveyUnitsData> => {
      return getRequest<SurveyUnitsData>(
        `${apiUrl}/questionnaires/${questionnaireId}/modes/${modeName}/survey-units`
      )(token);
    }
  );

  const checkSurveyUnitsCSV = useConstCallback(
    (
      poguesId: string,
      surveyUnitCSVData: File
    ): Promise<SurveyUnitsMessages> => {
      const formData = new FormData();
      formData.append("surveyUnitData", surveyUnitCSVData);

      return postRequestMultiPart<SurveyUnitsMessages>(
        `${apiUrl}/questionnaires/${poguesId}/checkdata`,
        formData
      )(token);
    }
  );

  const resetSurveyUnit = useConstCallback(
    (surveyUnitId: string): Promise<void> => {
      return putRequest<void>(
        `${apiUrl}/survey-units/${surveyUnitId}/reset`,
        undefined
      )(token);
    }
  );

  return {
    getSurveyUnitsData,
    checkSurveyUnitsCSV,
    resetSurveyUnit,
  };
}
