import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useSelector } from "react-redux";
import { IRootState } from "../../../types/redux/reducerStates.types";

function LogDialog({
  isOpen,
  handleClose,
  handleRefresh,
  dialogTitle,
  dialogText,
  commandRequestTopic,
  containerId,
}: any) {
  const [logFieldValue, setLogFieldValue] = React.useState("");
  const logData = useSelector((store: IRootState) => store.logData.logRawData);

  const initLogData = () => {
    containerId !== null && containerId !== undefined
      ? setLogFieldValue(logData[containerId])
      : setLogFieldValue("");
  };

  return (
    <div>
      <Dialog
        maxWidth="lg"
        fullWidth={true}
        open={isOpen}
        onEntering={initLogData}
        onEnter={handleRefresh}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">{dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialogText}</DialogContentText>
          <TextField
            margin="dense"
            type="text"
            fullWidth={true}
            multiline
            value={logFieldValue}
            rows={20}
            disabled
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => handleRefresh(containerId, commandRequestTopic)}
            color="primary"
          >
            Refresh
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default LogDialog;
