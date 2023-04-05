import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import { Questionnaire } from "core/application/model";
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
  const intl = useIntl();
  const queryClient = useQueryClient();

  const {
    mutate: deleteQuestionnaire,
    isLoading: isDeleting,
    isSuccess,
    isError,
  } = useApiMutation((id: number) => props.deleteQuestionnaire(id), {
    successMessage: intl.formatMessage({
      id: "questionnaire_delete_success",
    }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: "fetchQuestionnaires" });
    },
    onSettled: () => {
      setDisplayConfirmationDialog(isSuccess || isError);
    },
  });

  const deleteAction = () => {
    deleteQuestionnaire(props.questionnaire.id);
  };

  /**
   * open/close confirmation dialog
   */
  const openConfirmationDialog = () => {
    setDisplayConfirmationDialog(true);
  };

  /**
   * open/close confirmation dialog
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
          isSubmitting: isDeleting,
        }}
        handleConfirmation={deleteAction}
        displayConfirmationDialog={displayConfirmationDialog}
        closeConfirmationDialog={closeConfirmationDialog}
      />
    </>
  );
});

QuestionnaireDelete.displayName = "QuestionnaireDelete";
