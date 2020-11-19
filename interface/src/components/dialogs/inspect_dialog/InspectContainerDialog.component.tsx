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
import {INSPECT_CONTAINER_REQUEST} from "../../../util/socketEvents";
import {HubConnection} from "@microsoft/signalr";

function InspectContainerDialog({
    open,
    handleClose,
    dialogTitle,
    dialogText,
    commandRequestTopic,
    containerId
}: any) {
    const [inspectFieldValue, setInspectFieldValue] = React.useState("");
    const inspectData = useSelector((store: IRootState) => store.inspectData.inspectRawData);
    const socketConnection: HubConnection | undefined = useSelector((store: IRootState) => store.containerData.socketConnection);

    console.log("Cmd: " + commandRequestTopic + ", id: " + containerId);
    if(commandRequestTopic == null || containerId == null) {
        // handleClose();
    }

    const onRefresh = () => {
        if(socketConnection !== undefined && commandRequestTopic != null) {
            console.log("SOCKET INVOKING!");
            socketConnection.invoke(INSPECT_CONTAINER_REQUEST, commandRequestTopic, containerId);
        }
    };

    // React.useEffect(() => {
        console.log(inspectData);
        if(inspectData != null && containerId != null) {
            if(inspectData[containerId] != null) {
                if(inspectData[containerId] != inspectFieldValue) {
                    console.log("Setting field value!");
                    setInspectFieldValue(inspectData[containerId]);
                }
            }
        }
    //     setInspectFieldValue("");
    // }, [open]);


    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
                onKeyPress={(event) => (event.key === "Enter" ? onRefresh() : null)}
            >
                <DialogTitle id="form-dialog-title">{dialogTitle}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{dialogText}</DialogContentText>
                    <TextField
                        margin="dense"
                        label="Inspection data will be placed here when fetched"
                        type="text"
                        fullWidth
                        value={inspectFieldValue}
                        rows={10}
                        disabled
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={onRefresh} color="primary">
                        Refresh
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default InspectContainerDialog;
