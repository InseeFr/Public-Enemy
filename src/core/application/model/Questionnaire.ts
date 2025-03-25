import type { Mode, SurveyContext } from './'

export type Questionnaire = {
  id: number;
  poguesId: string;
  label: string;
  modes: Mode[];
  context: SurveyContext;
  surveyUnitData: File | undefined;
  isSynchronized: boolean;
};
