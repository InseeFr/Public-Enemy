import { SurveyUnitsData, SurveyUnitsMessages } from '../model'

export type SurveyUnitRepositoryPort = {
  getSurveyUnitsData: (id: number, modeName: string) => Promise<SurveyUnitsData>

  checkSurveyUnitsCSV: (
    poguesId: string,
    surveyUnitData: File,
  ) => Promise<SurveyUnitsMessages>

  getSurveyUnitsSchemaCSV: (poguesId: string) => Promise<void>
  getExistingSurveyUnitsSchemaCSV: (id: number) => Promise<void>

  resetSurveyUnit: (surveyUnitId: string) => Promise<void>
}
