import React from "react";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

function RenameDialog({
  open,
  handleClose,
  handleConfirmation,
  dialogTitle,
  dialogText,
  label,
  containerId,
  commandRequestTopic
}) {
  const [textFieldValue, setTextFieldValue] = React.useState("");

  React.useEffect(() => {
    setTextFieldValue("");
  }, [open]);

  const onConfirm = () => {
    handleClose();
    handleConfirmation(textFieldValue, containerId, commandRequestTopic);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        onKeyPress={(event) => (event.key === "Enter" ? onConfirm() : null)}
      >
        <DialogTitle id="form-dialog-title">{dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialogText}</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label={label}
            type="text"
            fullWidth
            value={textFieldValue}
            onChange={(event) => setTextFieldValue(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={onConfirm} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default RenameDialog;
