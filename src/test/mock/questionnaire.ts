import { Questionnaire } from "core/application/model";

export const simpleQuestionnaire: Questionnaire = {
  id: 0,
  poguesId: "l8wwljbo",
  label: "Label",
  modes: [
    {
      name: "CAWI",
      isWebMode: true,
    },
    {
      name: "CAPI",
      isWebMode: true,
    },
  ],
  context: {
    name: "HOUSEHOLD",
    value: "ménage",
  },
  interrogationData: undefined,
  isSynchronized: true,
};

export const questionnaireAdd: Questionnaire = {
  id: 0,
  poguesId: "l8wwljbo",
  label: "Label",
  modes: [
    {
      name: "CAWI",
      isWebMode: true,
    },
    {
      name: "CAPI",
      isWebMode: true,
    },
  ],
  context: {
    name: "",
  },
  interrogationData: undefined,
  isSynchronized: true,
};
