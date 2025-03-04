import { memo, useState } from 'react'

import DeleteIcon from '@mui/icons-material/Delete'
import { IconButton } from '@mui/material'
import { UseMutateFunction } from '@tanstack/react-query'
import { Questionnaire } from 'core/application/model'
import { ApiError } from 'core/application/model/error'
import { useNotifier } from 'core/infrastructure'
import { useIntl } from 'react-intl'

import { ConfirmationDialog } from './base'

type QuestionnaireDeleteButtonType = {
  questionnaire: Questionnaire
  mutateDelete: {
    deleteQuestionnaire: UseMutateFunction<
      void,
      ApiError,
      Questionnaire,
      unknown
    >
    isDeleting: boolean
  }
}

/**
 * Component used for questionnaire deletion
 */
export const QuestionnaireDeleteButton = memo(
  (props: QuestionnaireDeleteButtonType) => {
    const [displayConfirmationDialog, setDisplayConfirmationDialog] =
      useState(false)
    const intl = useIntl()
    const notifier = useNotifier()

    const deleteAction = async () => {
      props.mutateDelete.deleteQuestionnaire(props.questionnaire, {
        onSuccess: () => {
          notifier.success(
            intl.formatMessage({ id: 'questionnaire_delete_success' }),
          )
        },
        onSettled: () => {
          closeConfirmationDialog()
        },
      })
    }

    /**
     * open confirmation dialog
     */
    const openConfirmationDialog = () => {
      setDisplayConfirmationDialog(true)
    }

    /**
     * close confirmation dialog
     */
    const closeConfirmationDialog = () => {
      setDisplayConfirmationDialog(false)
    }

    return (
      <>
        <IconButton aria-label="delete" onClick={openConfirmationDialog}>
          <DeleteIcon />
        </IconButton>
        <ConfirmationDialog
          title={intl.formatMessage({
            id: 'questionnaire_delete_confirmation_label',
          })}
          body={intl.formatMessage(
            { id: 'questionnaire_delete_confirmation_body' },
            { name: props.questionnaire.label },
          )}
          disagreeBtn={{
            label: intl.formatMessage({
              id: 'questionnaire_delete_confirmation_disagree',
            }),
          }}
          agreeBtn={{
            label: intl.formatMessage({
              id: 'questionnaire_delete_confirmation_agree',
            }),
            isSubmitting: props.mutateDelete.isDeleting,
          }}
          handleConfirmation={deleteAction}
          displayConfirmationDialog={displayConfirmationDialog}
          closeConfirmationDialog={closeConfirmationDialog}
        />
      </>
    )
  },
)

QuestionnaireDeleteButton.displayName = 'QuestionnaireDeleteButton'
