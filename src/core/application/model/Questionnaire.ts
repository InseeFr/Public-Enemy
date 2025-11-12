import { Mode, SurveyContext } from "./";

export type Questionnaire = {
  id: number;
  poguesId: string;
  label: string;
  modes: Mode[];
  context: SurveyContext;
  interrogationData: File | undefined;
  isSynchronized: boolean;
};
