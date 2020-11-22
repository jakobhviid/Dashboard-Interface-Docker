import React from "react";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import {useSelector} from "react-redux";
import {IRootState} from "../../../types/redux/reducerStates.types";

function InspectContainerDialog({
    open,
    handleClose,
    handleRefresh,
    dialogTitle,
    dialogText,
    commandRequestTopic,
    containerId
}: any) {
    const [inspectFieldValue, setInspectFieldValue] = React.useState("");
    const inspectData = useSelector((store: IRootState) => store.inspectData.inspectRawData);

    const refreshFieldValue = () => {
        if(inspectData != null && containerId != null) {
            if(inspectData[containerId] != null) {
                if(inspectData[containerId] != inspectFieldValue) {
                    setInspectFieldValue(inspectData[containerId]);
                }
            } else if(inspectFieldValue != "") {
                setInspectFieldValue("");
            }
        }
    }
    refreshFieldValue();



    return (
        <div>
            <Dialog
                maxWidth="lg"
                fullWidth
                open={open}
                onEnter={() => handleRefresh()}
                onEntering={() => refreshFieldValue()}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
                onKeyPress={(event) => (event.key === "Enter" ? handleRefresh(containerId, commandRequestTopic) : null)}
            >
                <DialogTitle id="form-dialog-title">{dialogTitle}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{dialogText}</DialogContentText>
                    <TextField
                        margin="dense"
                        type="text"
                        fullWidth
                        multiline
                        value={inspectFieldValue}
                        rows={20}
                        disabled
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => handleRefresh(containerId, commandRequestTopic)} color="primary">
                        Refresh
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default InspectContainerDialog;
