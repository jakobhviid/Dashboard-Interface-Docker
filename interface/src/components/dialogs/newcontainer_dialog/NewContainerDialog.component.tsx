import React from "react";
import { HubConnection } from "@microsoft/signalr";
import { useDispatch, useSelector } from "react-redux";
import { produce } from "immer";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import PolicySection from "../reconfigure_dialog/sections/PolicySection.component";
import { Tooltip } from "@material-ui/core";
import { IRootState } from "../../../types/redux/reducerStates.types";
import { CREATE_NEW_CONTAINER_REQUEST } from "../../../util/socketEvents";
import { removeEmptyNullUndefinedValues } from "../../../util/helpers";
import { enqueueSnackbar } from "../../../redux/notifier/notifier.actions";
import {
  INewContainerValues,
  IContainerValuesToSend,
  templates,
} from "./Templates";

type NewContainerDialogProps = {
  open: boolean;
  handleClose: (event :any) => void;
  dialogTitle: string;
  servers: Array<any>;
};

function NewContainerDialog({
  open,
  handleClose,
  dialogTitle,
  servers,
}: NewContainerDialogProps) {
  const [values, setValues] = React.useState<INewContainerValues>({
    image: "",
    name: "",
    command: "",
    ports: [],
    environment: [],
    restartPolicy: { restartPolicy: "none", maximumRetryCount: "" },
    volumes: [],
    volumesFrom: [],
    networkMode: "",
  });
  const [selectedServer, setSelectedServer] = React.useState<string>(servers[0].url);
  const [selectedTemplate, setSelectedTemplate] = React.useState<string>("");
  const socketConnection: HubConnection | undefined = useSelector((store: IRootState) => store.containerData.socketConnection);
  const dispatch = useDispatch();

  function handleConfirmation() {
    if (values.image === "") {
      dispatch(
        enqueueSnackbar({
          message: "Image must be set!",
          options: {
            key: new Date().getTime() + Math.random(),
            persist: false,
            variant: "error",
          },
        })
      );
      return;
    }
    const valuesToSend = produce(
      values,
      (valuesCopy: IContainerValuesToSend) => {
        removeEmptyNullUndefinedValues(valuesCopy);

        if (values.restartPolicy.restartPolicy === "none")
          delete valuesCopy.restartPolicy;
      }
    );
    console.log(JSON.stringify(valuesToSend));
    if (socketConnection !== undefined)
      socketConnection.invoke(CREATE_NEW_CONTAINER_REQUEST, selectedServer, JSON.stringify(valuesToSend));
  }

  function handleAutoFillTemplate(templateName: string) {
    setSelectedTemplate(templateName);
    if (templateName === "") {
      setValues({
        image: "",
        name: "",
        command: "",
        ports: [],
        environment: [],
        restartPolicy: { restartPolicy: "none", maximumRetryCount: "" },
        volumes: [],
        volumesFrom: [],
        networkMode: "",
      });
      return;
    }
    var name: any = Object.keys(templates).find( (template) => template === templateName);

    const template: INewContainerValues = templates[name];
    setValues(template);
  }

  return (
    <div>
      <Dialog
        maxWidth="xl"
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        onKeyPress={(event) =>
          event.key === "Enter" ? handleConfirmation() : null
        }
      >
        <DialogTitle id="form-dialog-title">{dialogTitle}</DialogTitle>
        <DialogContent>
          <form noValidate autoComplete="off">
            <Grid container spacing={2}>
              <Grid item xs={12} style={{ padding: "2px", paddingLeft: "12px" }}>
                <Typography variant="subtitle2">
                  Server to Start Container On
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  variant="outlined"
                  label="Server"
                  select
                  SelectProps={{
                    native: true,
                  }}
                  type="text"
                  fullWidth
                  value={selectedServer}
                  onChange={(event: any) =>
                    setSelectedServer(event.target.value)
                  }
                >
                  {servers.map((server: any) => (
                    <option key={server.url} value={server.url}>
                      {server.name}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} style={{ padding: "2px", paddingLeft: "12px" }}>
                <Typography variant="subtitle2">
                  Choose a Template Here
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  variant="outlined"
                  label="Autofill Template"
                  select
                  SelectProps={{native: true,}}
                  type="text"
                  fullWidth
                  value={selectedTemplate}
                  onChange={(event: any) => handleAutoFillTemplate(event.target.value)}
                >
                  <option key={"none"} value={""} />
                  {Object.keys(templates).map((templateName: string) => (
                    <option key={templateName} value={templateName}>
                      {templateName}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} style={{ padding: "2px", paddingLeft: "12px" }}>
                <Typography variant="subtitle2">Basics</Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  variant="outlined"
                  label="Image"
                  type="text"
                  fullWidth
                  autoFocus
                  value={values.image}
                  onChange={(event) =>
                    setValues({ ...values, image: event.target.value })
                  }
                  helperText="Image to Run (example: ubuntu)"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  variant="outlined"
                  label="Container Name"
                  type="text"
                  fullWidth
                  value={values.name}
                  onChange={(event) =>
                    setValues({ ...values, name: event.target.value })
                  }
                  helperText="The Name of the Container"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  label="Command"
                  type="text"
                  fullWidth
                  value={values.command}
                  onChange={(event) => {
                    setValues({ ...values, command: event.target.value });
                  }}
                  helperText="Optional Command to Run on Startup"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  label="Network Mode"
                  type="text"
                  fullWidth
                  value={values.networkMode}
                  onChange={(event) => {
                    setValues({ ...values, networkMode: event.target.value });
                  }}
                  helperText="Network Mode (example: host)"
                />
              </Grid>

              <PolicySection
                restartValue={values.restartPolicy}
                restartNameOnChange={(event: any) =>
                  setValues({
                    ...values,
                    restartPolicy: {
                      ...values.restartPolicy,
                      restartPolicy: event.target.value,
                    },
                  })
                }
                restartRetryCountOnChange={(event: any) =>
                  setValues({
                    ...values,
                    restartPolicy: {
                      ...values.restartPolicy,
                      maximumRetryCount: event.target.value,
                    },
                  })
                }
                headerInvisible={true}
              />

              <Grid container alignItems="center" justify="center">
                <Grid item xs={10} style={{ padding: "2px", paddingLeft: "12px" }}>
                  <Typography variant="subtitle2">Ports</Typography>
                </Grid>
                <Grid item xs={1}>
                  <Tooltip title="Remove Port Binding">
                    <IconButton
                      onClick={() => {
                        const updatedPorts = [...values.ports];
                        updatedPorts.pop();
                        setValues({
                          ...values,
                          ports: updatedPorts,
                        });
                      }}
                    >
                      <RemoveIcon color="primary" aria-label="delete port binding"/>
                    </IconButton>
                  </Tooltip>
                </Grid>
                <Grid item xs={1}>
                  <Tooltip title="Add Port Binding">
                    <IconButton
                      onClick={() => {
                        setValues({...values,
                          ports: [...values.ports, {containerPort: "", hostPort: "" },],
                        });
                      }}
                    >
                      <AddIcon color="primary" aria-label="add port binding" />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>

              {values.ports.map((ports: any, index: any) => (
                <React.Fragment key={index}>
                  <Grid item xs={6}>
                    <TextField
                      variant="outlined"
                      label="Host Port"
                      type="number"
                      fullWidth
                      value={ports.hostPort}
                      onChange={(event) => {
                        const updatedPorts = [...values.ports];
                        updatedPorts[index] = {...updatedPorts[index], hostPort: event.target.value,};
                        setValues({...values, ports: updatedPorts,});
                      }}
                      helperText="Port to Expose on Host"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      variant="outlined"
                      label="Container Port"
                      type="number"
                      fullWidth
                      value={ports.containerPort}
                      onChange={(event) => {
                        const updatedPorts = [...values.ports];
                        updatedPorts[index] = {...updatedPorts[index], containerPort: event.target.value,};
                        setValues({...values, ports: updatedPorts,});
                      }}
                      helperText="Port to Listen Inside Container"
                    />
                  </Grid>
                </React.Fragment>
              ))}

              <Grid container alignItems="center" justify="center">
                <Grid item xs={10} style={{ padding: "2px", paddingLeft: "12px" }}>
                  <Typography variant="subtitle2">
                    Environment Variables
                  </Typography>
                </Grid>
                <Grid item xs={1}>
                  <Tooltip title="Remove Environment Variable">
                    <IconButton
                      onClick={() => {
                        const updatedEnvironment = [...values.environment];
                        updatedEnvironment.pop();
                        setValues({...values, environment: updatedEnvironment,});
                      }}
                    >
                      <RemoveIcon color="primary" aria-label="delete environment variable"/>
                    </IconButton>
                  </Tooltip>
                </Grid>
                <Grid item xs={1}>
                  <Tooltip title="Add Environment Variable">
                    <IconButton
                      onClick={() => {
                        setValues({...values, environment: [...values.environment,{ key: "", value: "" },],});
                      }}
                    >
                      <AddIcon color="primary" aria-label="add environment variable"/>
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>

              {values.environment.map((environment: any, index: number) => (
                <React.Fragment key={index}>
                  <Grid item xs={6}>
                    <TextField
                      variant="outlined"
                      label="Environment Key"
                      type="text"
                      fullWidth
                      value={environment.key}
                      onChange={(event) => {
                        const updatedEnvironment = [...values.environment];
                        updatedEnvironment[index] = {...updatedEnvironment[index], key: event.target.value,};
                        setValues({...values, environment: updatedEnvironment,});
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      variant="outlined"
                      label="Environment Value"
                      type="text"
                      fullWidth
                      value={environment.value}
                      onChange={(event) => {
                        const updatedEnvironment = [...values.environment];
                        updatedEnvironment[index] = {...updatedEnvironment[index], value: event.target.value,};
                        setValues({...values, environment: updatedEnvironment,});
                      }}
                    />
                  </Grid>
                </React.Fragment>
              ))}

              <Grid container alignItems="center" justify="center">
                <Grid item xs={10} style={{ padding: "2px", paddingLeft: "12px" }}>
                  <Typography variant="subtitle2">Volumes</Typography>
                </Grid>
                <Grid item xs={1}>
                  <Tooltip title="Remove Volume Declaration">
                    <IconButton
                      onClick={() => {
                        const updatedVolumes = [...values.volumes];
                        updatedVolumes.pop();
                        setValues({...values, volumes: updatedVolumes,});
                      }}
                    >
                      <RemoveIcon color="primary" aria-label="delete volume" />
                    </IconButton>
                  </Tooltip>
                </Grid>
                <Grid item xs={1}>
                  <Tooltip title="Add Volume Declaration">
                    <IconButton
                      onClick={() => {
                        setValues({...values, volumes: [...values.volumes,
                          { hostPath: "", containerPath: "" },],
                        });
                      }}
                    >
                      <AddIcon color="primary" aria-label="add volume" />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>

              {values.volumes.map((volume: any, index: any) => (
                <React.Fragment key={index}>
                  <Grid item xs={6}>
                    <TextField
                      variant="outlined"
                      label="Host Path"
                      type="text"
                      fullWidth
                      value={volume.hostPath}
                      onChange={(event) => {
                        const updatedVolumes = [...values.volumes];
                        updatedVolumes[index] = {...updatedVolumes[index], hostPath: event.target.value,};
                        setValues({...values, volumes: updatedVolumes,});
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      variant="outlined"
                      label="Container Path"
                      type="text"
                      fullWidth
                      value={volume.containerPath}
                      onChange={(event) => {
                        const updatedVolumes = [...values.volumes];
                        updatedVolumes[index] = {...updatedVolumes[index], containerPath: event.target.value,};
                        setValues({...values, volumes: updatedVolumes,});
                      }}
                    />
                  </Grid>
                </React.Fragment>
              ))}
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmation} color="primary">
            Create Container
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default NewContainerDialog;
