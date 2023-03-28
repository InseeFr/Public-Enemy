import { SurveyUnitsData, SurveyUnitsMessages } from "../model";
import { SurveyUnitRepositoryPort } from "../port";

export type SurveyUnitUseCaseType = {
  getSurveyUnitsData: (
    id: number,
    modeName: string
  ) => Promise<SurveyUnitsData>;

  checkSurveyUnitsCSV: (
    poguesId: string,
    surveyUnitsCSVData: File
  ) => Promise<SurveyUnitsMessages>;
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

  const checkSurveyUnitsCSV = (
    poguesId: string,
    surveyUnitsCSVData: File
  ): Promise<SurveyUnitsMessages> => {
    return surveyUnitRepository.checkSurveyUnitsCSV(
      poguesId,
      surveyUnitsCSVData
    );
  };

  return {
    getSurveyUnitsData,
    checkSurveyUnitsCSV,
  };
}
