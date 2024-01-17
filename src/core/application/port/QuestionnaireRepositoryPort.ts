import { Questionnaire, SurveyContext } from "../model";

export type QuestionnaireRepositoryPort = {
  getQuestionnaires: () => Promise<Questionnaire[]>;
  getQuestionnaire: (id: number) => Promise<Questionnaire>;
  getQuestionnaireFromPoguesId: (
    poguesId: string | undefined
  ) => Promise<Questionnaire>;
  getPoguesQuestionnaire: (poguesId: string) => Promise<Questionnaire>;
  addQuestionnaire: (questionnaire: Questionnaire) => Promise<Questionnaire>;
  deleteQuestionnaire: (id: number) => Promise<void>;
  editQuestionnaire: (questionnaire: Questionnaire) => Promise<Questionnaire>;
  getSurveyContexts: () => Promise<SurveyContext[]>;
};
