import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import { Questionnaire } from "core/application/model";
import { useNotifier } from "core/infrastructure";
import { useApiMutation } from "core/infrastructure/hooks/useApiMutation";
import { memo, useState } from "react";
import { useIntl } from "react-intl";
import { useQueryClient } from "react-query";
import { ConfirmationDialog } from "./base";

type QuestionnaireDeleteType = {
  questionnaire: Questionnaire;
  deleteQuestionnaire: (id: number) => Promise<void>;
};

/**
 * Component used for questionnaire deletion
 */
export const QuestionnaireDelete = memo((props: QuestionnaireDeleteType) => {
  const [displayConfirmationDialog, setDisplayConfirmationDialog] =
    useState(false);
  const notifier = useNotifier();
  const intl = useIntl();
  const queryClient = useQueryClient();

  const { mutate: deleteQuestionnaire, isLoading: isDeleting } = useApiMutation(
    (id: number) => props.deleteQuestionnaire(id),
    {
      onSuccess: () => {
        notifier.success(
          intl.formatMessage({ id: "questionnaire_delete_success" })
        );
        queryClient.invalidateQueries({ queryKey: "fetchQuestionnaires" });
      },
      onSettled: () => {
        setDisplayConfirmationDialog(false);
      },
    }
  );

  const deleteAction = () => {
    deleteQuestionnaire(props.questionnaire.id);
  };

  /**
   * open/close confirmation dialog
   */
  const toggleConfirmationDialog = () => {
    setDisplayConfirmationDialog(!displayConfirmationDialog);
  };

  return (
    <>
      <IconButton aria-label="delete" onClick={toggleConfirmationDialog}>
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
          isSubmitting: isDeleting,
        }}
        handleConfirmation={deleteAction}
        displayConfirmationDialog={displayConfirmationDialog}
        setDisplayConfirmationDialog={setDisplayConfirmationDialog}
      />
    </>
  );
});

QuestionnaireDelete.displayName = "QuestionnaireDelete";
