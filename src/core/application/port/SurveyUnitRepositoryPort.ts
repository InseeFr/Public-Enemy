import { SurveyUnitsData } from "../model";

export type SurveyUnitRepositoryPort = {
  getSurveyUnitsData: (
    id: number,
    modeName: string
  ) => Promise<SurveyUnitsData>;
};
