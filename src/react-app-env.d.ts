/// <reference types="react-scripts" />

import { LocaleType } from "core/i18n/messages";

export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      REACT_APP_API_URL: string;
      REACT_APP_ORCHESTRATOR_URL: string;
      REACT_APP_LOCALE: LocaleType;
    }
  }
}
