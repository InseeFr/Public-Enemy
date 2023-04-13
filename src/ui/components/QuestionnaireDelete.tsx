import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import { Questionnaire } from "core/application/model";
import { ApiError } from "core/application/model/error";
import { useNotifier } from "core/infrastructure";
import { memo, useState } from "react";
import { useIntl } from "react-intl";
import { UseMutateFunction } from "react-query";
import { ConfirmationDialog } from "./base";

type QuestionnaireDeleteType = {
  questionnaire: Questionnaire;
  mutateDelete: {
    deleteQuestionnaire: UseMutateFunction<
      void,
      ApiError,
      Questionnaire,
      unknown
    >;
    isDeleting: boolean;
  };
};

/**
 * Component used for questionnaire deletion
 */
export const QuestionnaireDelete = memo((props: QuestionnaireDeleteType) => {
  const [displayConfirmationDialog, setDisplayConfirmationDialog] =
    useState(false);
  const intl = useIntl();
  const notifier = useNotifier();

  const deleteAction = () => {
    props.mutateDelete.deleteQuestionnaire(props.questionnaire, {
      onSuccess: () => {
        notifier.success(
          intl.formatMessage({ id: "questionnaire_delete_success" })
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
      <IconButton aria-label="delete" onClick={openConfirmationDialog}>
        <DeleteIcon />
      </IconButton>
      <ConfirmationDialog
        title={intl.formatMessage({
          id: "questionnaire_delete_confirmation_label",
        })}
        body={intl.formatMessage(
          { id: "questionnaire_delete_confirmation_body" },
          { name: props.questionnaire.label }
        )}
        disagreeBtn={{
          label: intl.formatMessage({
            id: "questionnaire_delete_confirmation_disagree",
          }),
        }}
        agreeBtn={{
          label: intl.formatMessage({
            id: "questionnaire_delete_confirmation_agree",
          }),
          isSubmitting: props.mutateDelete.isDeleting,
        }}
        handleConfirmation={deleteAction}
        displayConfirmationDialog={displayConfirmationDialog}
        closeConfirmationDialog={closeConfirmationDialog}
      />
    </>
  );
});

QuestionnaireDelete.displayName = "QuestionnaireDelete";
