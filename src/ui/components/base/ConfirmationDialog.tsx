import { LoadingButton } from "@mui/lab";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { memo } from "react";

type DialogTypeProps = {
  title: string;
  body: string;
  agreeBtn: { label: string; isSubmitting?: boolean };
  disagreeBtn: { label: string };
  handleConfirmation: () => void;
  displayConfirmationDialog: boolean;
  setDisplayConfirmationDialog: (open: boolean) => void;
};

/**
 * Agree/DIsagree confirmation dialog
 */
export const ConfirmationDialog = memo(
  ({
    title,
    body,
    agreeBtn,
    disagreeBtn,
    handleConfirmation,
    displayConfirmationDialog,
    setDisplayConfirmationDialog,
  }: DialogTypeProps) => {
    /**
     * Toogle confirmation dialog
     */
    const toggleConfirmationDialog = () => {
      setDisplayConfirmationDialog(!displayConfirmationDialog);
    };

    return (
      <Dialog
        open={displayConfirmationDialog}
        onClose={toggleConfirmationDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        data-testid="confirmation-dialog"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {body}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            data-testid="confirmation-disagree"
            color="error"
            variant="contained"
            onClick={toggleConfirmationDialog}
          >
            {disagreeBtn.label}
          </Button>
          <LoadingButton
            data-testid="confirmation-agree"
            color="info"
            variant="contained"
            onClick={handleConfirmation}
            autoFocus
            loading={agreeBtn.isSubmitting ?? false}
          >
            {agreeBtn.label}
          </LoadingButton>
        </DialogActions>
      </Dialog>
    );
  }
);

ConfirmationDialog.displayName = "ConfirmationDialog";
