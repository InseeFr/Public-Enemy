import { SurveyUnitsData } from "../model";
import { SurveyUnitRepositoryPort } from "../port";

export type SurveyUnitUseCaseType = {
  getSurveyUnitsData: (
    id: number,
    modeName: string
  ) => Promise<SurveyUnitsData>;
};

/**
 * Create the use case for surveyUnit
 * @param surveyUnitRepository
 * @returns surveyUnit use case
 */
export function createSurveyUnitUseCase(
  surveyUnitRepository: SurveyUnitRepositoryPort
): SurveyUnitUseCaseType {
  /**
   * Get all surveyUnits
   * @returns promise of all surveyUnits
   */
  const getSurveyUnitsData = (
    id: number,
    modeName: string
  ): Promise<SurveyUnitsData> => {
    return surveyUnitRepository.getSurveyUnitsData(id, modeName);
  };

  return {
    getSurveyUnitsData,
  };
}
