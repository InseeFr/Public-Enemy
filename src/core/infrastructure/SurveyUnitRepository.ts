import { SurveyUnitsData } from "core/application/model";
import { SurveyUnitRepositoryPort } from "core/application/port";
import { getRequest } from "core/utils/http";

/**
 * Get SurveyUnit Repository
 * @param apiUrl surveyUnit CRUD API URL
 * @returns surveyUnit repository
 */
export function createSurveyUnitRepository(
  apiUrl: string
): SurveyUnitRepositoryPort {
  const getSurveyUnitsData = (
    id: number,
    modeName: string
  ): Promise<SurveyUnitsData> => {
    return getRequest<SurveyUnitsData>(
      `${apiUrl}/questionnaires/${id}/modes/${modeName}/survey-units`
    );
  };

  return {
    getSurveyUnitsData,
  };
}
