import { InterrogationsMessages } from "core/application/model";
import {
  ApiErrorDetails,
  ErrorDetailsInterrogation,
} from "core/application/model/error";
import { useState } from "react";
import { useCsvApiMutation } from "./useCsvApiMutation";

type ErrorCodes = {
  1001: string[];
  1002: ErrorDetailsInterrogation[];
};

export type CsvMessages = {
  warnings?: string[];
  errors?: string[];
  details?: ErrorDetailsInterrogation[];
};

export const useCsvChecks = (
  checkInterrogationsCsvData: (
    poguesId: string,
    interrogationsCSVData: File
  ) => Promise<InterrogationsMessages>
) => {
  const [messages, setMessages] = useState<CsvMessages>();

  const {
    mutate: checkCsvData,
    isPending: isCheckingCsvData,
    isSuccess,
    reset,
  } = useCsvApiMutation({
    mutationKey: ["csv-check"],
    mutationFn: ({ id, data }: { id: string; data: File }) => {
      return checkInterrogationsCsvData(id, data);
    },
    options: {
      onMutate: () => {
        setMessages({
          warnings: undefined,
          errors: undefined,
          details: undefined,
        });
      },
      onSuccess: (warningMessages) => {
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
    },
  });

  /**
   * force type check on ApiErrorDetails to get the correct type
   */
  function isErrorCode<Code extends keyof ErrorCodes>(
    err: ApiErrorDetails,
    code: Code
  ): err is ApiErrorDetails<ErrorCodes[Code]> {
    return err.code === code;
  }

  return { checkCsvData, messages, isSuccess, isCheckingCsvData, reset };
};
