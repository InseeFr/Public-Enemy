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
    if (!messages.warnings) {
      return;
    }
    const messageWarnings = (
      <>
        {messages.warnings.map((message: string) => (
          <React.Fragment key={`message-${message}`}>
            {message}
            <br />
          </React.Fragment>
        ))}
        {intl.formatMessage({ id: "survey_unit_csv_validation_warnings" })}
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
          {messages.errors?.map((message) => (
            <React.Fragment key={`message-${message}`}>
              {message} <br />
            </React.Fragment>
          ))}

          {messages.details?.map((surveyUnitError) => (
            <React.Fragment key={`surveyUnit-${surveyUnitError.surveyUnitId}`}>
              <strong>
                {intl.formatMessage({ id: "survey_unit_label" })}{" "}
                {surveyUnitError.surveyUnitId}
              </strong>
              <ul>
                {surveyUnitError.attributesErrors?.map((attributeError) =>
                  attributeError.messages?.map((message) => (
                    <li
                      key={`attribute-${attributeError.attributeKey}-${message}`}
                    >
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
