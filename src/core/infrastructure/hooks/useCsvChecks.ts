import { SurveyUnitsMessages } from "core/application/model";
import {
  ApiErrorDetails,
  ErrorDetailsSurveyUnit,
} from "core/application/model/error";
import { useState } from "react";
import { useCsvApiMutation } from "./useCsvApiMutation";

type ErrorCodes = {
  1001: string[];
  1002: ErrorDetailsSurveyUnit[];
};

export type CsvMessages = {
  warnings?: string[];
  errors?: string[];
  details?: ErrorDetailsSurveyUnit[];
};

export const useCsvChecks = (
  checkSurveyUnitsCsvData: (
    poguesId: string,
    surveyUnitsCSVData: File
  ) => Promise<SurveyUnitsMessages>
) => {
  const [isCsvDataValid, setCsvDataValid] = useState(false);
  const [messages, setMessages] = useState<CsvMessages>();

  const { mutate: checkCsvData, isLoading: isCheckingCsvData } =
    useCsvApiMutation(
      ({ id, data }: { id: string; data: File }) => {
        return checkSurveyUnitsCsvData(id, data);
      },
      {
        onMutate() {
          setMessages({
            ...messages,
            warnings: undefined,
            errors: undefined,
            details: undefined,
          });
          setCsvDataValid(false);
        },
        onSuccess: (warningMessages) => {
          setCsvDataValid(true);
          setMessages({ warnings: warningMessages });
        },
        onError: (err: ApiErrorDetails) => {
          if (isErrorCode(err, 1001)) {
            setMessages({ errors: err.details });
            return;
          }

          if (isErrorCode(err, 1002)) {
            setMessages({ details: err.details });
            return;
          }
          setMessages({ errors: [err.message] });
        },
      }
    );

  /**
   * force type check on ApiErrorDetails to get the correct type
   */
  function isErrorCode<Code extends keyof ErrorCodes>(
    err: ApiErrorDetails,
    code: Code
  ): err is ApiErrorDetails<ErrorCodes[Code]> {
    return err.code === code;
  }

  return { checkCsvData, messages, isCsvDataValid, isCheckingCsvData };
};
