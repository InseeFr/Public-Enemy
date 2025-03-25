import { messagesEn } from "i18n-en";
import { messagesFr } from "i18n-fr";

export type LocaleType = "fr" | "en";

export const getMessages = (locale: LocaleType) => {
  switch (locale) {
    case "fr":
      return messagesFr;
    default:
      return messagesEn;
  }
};
