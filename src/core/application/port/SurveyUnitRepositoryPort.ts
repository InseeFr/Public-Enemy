import { SurveyUnitsData, SurveyUnitsMessages } from "../model";

export type SurveyUnitRepositoryPort = {
  getSurveyUnitsData: (
    id: number,
    modeName: string
  ) => Promise<SurveyUnitsData>;

  checkSurveyUnitsCSV: (
    poguesId: string,
    surveyUnitData: File
  ) => Promise<SurveyUnitsMessages>;
};
