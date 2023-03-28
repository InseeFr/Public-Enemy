import { Alert, AlertTitle } from "@mui/material";
import { ErrorDetailsSurveyUnit } from "core/application/model/error";
import React, { memo } from "react";

export type CSVAlertProps = {
  globalMessagesErrors?: string[];
  surveyUnitsErrors?: ErrorDetailsSurveyUnit[];
};

export const CSVAlert = memo((props: CSVAlertProps) => {
  return (
    <Alert severity="error">
      <AlertTitle>
        Une erreur est survenue pendant la vérification des données
      </AlertTitle>
      {props.globalMessagesErrors?.map((message, index) => (
        <React.Fragment key={`${index}`}>
          {message} <br />
        </React.Fragment>
      ))}

      {props.surveyUnitsErrors?.map((surveyUnitError, indexSU) => (
        <React.Fragment key={`${indexSU}`}>
          <strong>Unité enquêtée {surveyUnitError.surveyUnitId}</strong>
          <ul>
            {surveyUnitError.attributesErrors?.map((attributeError) =>
              attributeError.messages?.map((message, indexMessage) => (
                <li key={`${attributeError.attributeKey}-${indexMessage}`}>
                  Variable &quot;{attributeError.attributeKey}&quot;: {message}
                </li>
              ))
            )}
          </ul>
        </React.Fragment>
      ))}
    </Alert>
  );
});

CSVAlert.displayName = "CSVAlert";
