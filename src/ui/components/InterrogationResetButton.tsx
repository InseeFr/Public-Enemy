import RefreshIcon from "@mui/icons-material/Refresh";
import { IconButton } from "@mui/material";
import { UseMutateFunction } from "@tanstack/react-query";
import { ApiError } from "core/application/model/error";
import { useNotifier } from "core/infrastructure";
import { memo, useState } from "react";
import { useIntl } from "react-intl";
import { ConfirmationDialog } from "./base";

type InterrogationResetButtonType = {
  interrogationId: string;
  mutateReset: {
    resetInterrogation: UseMutateFunction<void, ApiError, string, unknown>;
    isResetting: boolean;
  };
};

/**
 * Component used for questionnaire deletion
 */
export const InterrogationResetButton = memo(
  (props: InterrogationResetButtonType) => {
    const [displayConfirmationDialog, setDisplayConfirmationDialog] =
      useState(false);
    const intl = useIntl();
    const notifier = useNotifier();

    const resetAction = () => {
      props.mutateReset.resetInterrogation(props.interrogationId, {
        onSuccess: () => {
          notifier.success(
            intl.formatMessage({ id: "survey_unit_reset_success" })
          );
        },
        onSettled: () => {
          closeConfirmationDialog();
        },
      });
    };

    /**
     * open confirmation dialog
     */
    const openConfirmationDialog = () => {
      setDisplayConfirmationDialog(true);
    };

    /**
     * close confirmation dialog
     */
    const closeConfirmationDialog = () => {
      setDisplayConfirmationDialog(false);
    };

    return (
      <>
        <IconButton
          aria-label="reset survey unit data"
          onClick={openConfirmationDialog}
        >
          <RefreshIcon />
        </IconButton>
        <ConfirmationDialog
          title={intl.formatMessage({
            id: "survey_unit_reset_confirmation_label",
          })}
          body={intl.formatMessage({
            id: "survey_unit_reset_confirmation_body",
          })}
          disagreeBtn={{
            label: intl.formatMessage({
              id: "survey_unit_reset_confirmation_disagree",
            }),
          }}
          agreeBtn={{
            label: intl.formatMessage({
              id: "survey_unit_reset_confirmation_agree",
            }),
            isSubmitting: props.mutateReset.isResetting,
          }}
          handleConfirmation={resetAction}
          displayConfirmationDialog={displayConfirmationDialog}
          closeConfirmationDialog={closeConfirmationDialog}
        />
      </>
    );
  }
);

InterrogationResetButton.displayName = "InterrogationResetButton";
