import { Alert, AlertTitle } from "@mui/material";
import { useNotifier } from "core/infrastructure";
import { CsvMessages } from "core/infrastructure/hooks/useCsvChecks";
import React, { memo, useEffect } from "react";
import { useIntl } from "react-intl";

type CsvAlertType = {
  messages: CsvMessages;
};

export const CsvAlert = memo(({ messages }: CsvAlertType) => {
  const intl = useIntl();
  const notifier = useNotifier();

  useEffect(() => {
    console.log(messages);
    if (!messages.warnings) {
      return;
    }
    const messageWarnings = (
      <>
        {messages.warnings.map((message: string, index: number) => (
          <React.Fragment key={`${index}-${message}`}>
            {message}
            <br />
          </React.Fragment>
        ))}
        Ces informations ne seront donc pas prises en compte.
      </>
    );
    notifier.info(messageWarnings);
  }, [messages]);

  return (
    <>
      {(messages.errors || messages.details) && (
        <Alert severity="error">
          <AlertTitle>
            {intl.formatMessage({ id: "survey_unit_csv_validation_error" })}
          </AlertTitle>
          {messages.errors?.map((message, index) => (
            <React.Fragment key={`${index}`}>
              {message} <br />
            </React.Fragment>
          ))}

          {messages.details?.map((surveyUnitError, indexSU) => (
            <React.Fragment key={`${indexSU}`}>
              <strong>
                {intl.formatMessage({ id: "survey_unit_label" })}{" "}
                {surveyUnitError.surveyUnitId}
              </strong>
              <ul>
                {surveyUnitError.attributesErrors?.map((attributeError) =>
                  attributeError.messages?.map((message, indexMessage) => (
                    <li key={`${attributeError.attributeKey}-${indexMessage}`}>
                      {intl.formatMessage({ id: "survey_unit_variable" })}{" "}
                      &quot;
                      {attributeError.attributeKey}&quot;: {message}
                    </li>
                  ))
                )}
              </ul>
            </React.Fragment>
          ))}
        </Alert>
      )}
    </>
  );
});

CsvAlert.displayName = "CsvAlert";
