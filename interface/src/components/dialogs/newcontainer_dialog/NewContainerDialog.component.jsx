import React from "react";

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

function NewContainerDialog({
  open,
  handleClose,
  handleConfirmation,
  dialogTitle,
  servers,
}) {
    // TODO: change this when commando server has changed
  const [values, setValues] = React.useState({
    image: "",
    name: "",
    command: "",
    ports: [],
    environment: [],
    restart_policy: { name: "{}", maximumRetryCount: "" },
    volumes: [],
    server: servers[0].url,
  });

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        onKeyPress={(event) =>
          event.key === "Enter" ? handleConfirmation(values) : null
        }
      >
        <DialogTitle id="form-dialog-title">{dialogTitle}</DialogTitle>
        <DialogContent>
          <form noValidate autoComplete="off">
            <Grid container spacing={2}>
              <Grid
                item
                xs={12}
                style={{ padding: "2px", paddingLeft: "12px" }}
              >
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
                  value={values.server}
                  onChange={(event) =>
                    setValues({ ...values, server: event.target.value })
                  }
                >
                  {servers.map((server) => (
                    <option key={server.url} value={server.url}>
                      {server.name}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <Grid
                item
                xs={12}
                style={{ padding: "2px", paddingLeft: "12px" }}
              >
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
                  helperText="Image to Run (example: ubuntu:18.04)"
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
                  onChange={(event) =>
                    setValues({ ...values, command: event.target.value })
                  }
                  helperText="Optional Command to Run on Startup"
                />
              </Grid>

              <PolicySection
                restartValue={values.restart_policy}
                restartNameOnChange={(event) =>
                  setValues({
                    ...values,
                    restart_policy: {
                      ...values.restart_policy,
                      name: event.target.value,
                    },
                  })
                }
                restartRetryCountOnChange={(event) =>
                  setValues({
                    ...values,
                    restart_policy: {
                      ...values.restart_policy,
                      maximumRetryCount: event.target.value,
                    },
                  })
                }
                headerInvisible={true}
              />

              <Grid container alignItems="center" justify="center">
                <Grid
                  item
                  xs={10}
                  style={{ padding: "2px", paddingLeft: "12px" }}
                >
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
                      <RemoveIcon
                        color="primary"
                        aria-label="delete port binding"
                      />
                    </IconButton>
                  </Tooltip>
                </Grid>
                <Grid item xs={1}>
                  <Tooltip title="Add Port Binding">
                    <IconButton
                      onClick={() => {
                        setValues({
                          ...values,
                          ports: [
                            ...values.ports,
                            { portHost: "", portContainer: "" },
                          ],
                        });
                      }}
                    >
                      <AddIcon color="primary" aria-label="add port binding" />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>

              {values.ports.map((port, index) => (
                <React.Fragment key={index}>
                  <Grid item xs={6}>
                    <TextField
                      variant="outlined"
                      label="Host Port"
                      type="number"
                      fullWidth
                      value={port.portHost}
                      onChange={(event) => {
                        const updatedPorts = [...values.ports];
                        updatedPorts[index] = {
                          ...updatedPorts[index],
                          portHost: event.target.value,
                        };
                        setValues({
                          ...values,
                          ports: updatedPorts,
                        });
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
                      value={port.portContainer}
                      onChange={(event) => {
                        const updatedPorts = [...values.ports];
                        updatedPorts[index] = {
                          ...updatedPorts[index],
                          portContainer: event.target.value,
                        };
                        setValues({
                          ...values,
                          ports: updatedPorts,
                        });
                      }}
                      helperText="Port to Listen Inside Container"
                    />
                  </Grid>
                </React.Fragment>
              ))}

              <Grid container alignItems="center" justify="center">
                <Grid
                  item
                  xs={10}
                  style={{ padding: "2px", paddingLeft: "12px" }}
                >
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
                        setValues({
                          ...values,
                          environment: updatedEnvironment,
                        });
                      }}
                    >
                      <RemoveIcon
                        color="primary"
                        aria-label="delete environment variable"
                      />
                    </IconButton>
                  </Tooltip>
                </Grid>
                <Grid item xs={1}>
                  <Tooltip title="Add Environment Variable">
                    <IconButton
                      onClick={() => {
                        setValues({
                          ...values,
                          environment: [
                            ...values.environment,
                            { key: "", value: "" },
                          ],
                        });
                      }}
                    >
                      <AddIcon
                        color="primary"
                        aria-label="add environment variable"
                      />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>

              {values.environment.map((environment, index) => (
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
                        updatedEnvironment[index] = {
                          ...updatedEnvironment[index],
                          key: event.target.value,
                        };
                        setValues({
                          ...values,
                          environment: updatedEnvironment,
                        });
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
                        updatedEnvironment[index] = {
                          ...updatedEnvironment[index],
                          value: event.target.value,
                        };
                        setValues({
                          ...values,
                          environment: updatedEnvironment,
                        });
                      }}
                    />
                  </Grid>
                </React.Fragment>
              ))}

              <Grid container alignItems="center" justify="center">
                <Grid
                  item
                  xs={10}
                  style={{ padding: "2px", paddingLeft: "12px" }}
                >
                  <Typography variant="subtitle2">Volumes</Typography>
                </Grid>
                <Grid item xs={1}>
                  <Tooltip title="Remove Volume Declaration">
                    <IconButton
                      onClick={() => {
                        const updatedVolumes = [...values.volumes];
                        updatedVolumes.pop();
                        setValues({
                          ...values,
                          volumes: updatedVolumes,
                        });
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
                        setValues({
                          ...values,
                          volumes: [
                            ...values.volumes,
                            { hostPath: "", bind: "", mode: "rw" },
                          ],
                        });
                      }}
                    >
                      <AddIcon color="primary" aria-label="add volume" />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>

              {values.volumes.map((volume, index) => (
                <React.Fragment key={index}>
                  <Grid item xs={5}>
                    <TextField
                      variant="outlined"
                      label="Host Path"
                      type="text"
                      fullWidth
                      value={volume.hostPath}
                      onChange={(event) => {
                        const updatedVolumes = [...values.volumes];
                        updatedVolumes[index] = {
                          ...updatedVolumes[index],
                          hostPath: event.target.value,
                        };
                        setValues({
                          ...values,
                          volumes: updatedVolumes,
                        });
                      }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      variant="outlined"
                      label="Container Path"
                      type="text"
                      fullWidth
                      value={volume.bind}
                      onChange={(event) => {
                        const updatedVolumes = [...values.volumes];
                        updatedVolumes[index] = {
                          ...updatedVolumes[index],
                          bind: event.target.value,
                        };
                        setValues({
                          ...values,
                          volumes: updatedVolumes,
                        });
                      }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      variant="outlined"
                      label="Volume Mode"
                      select
                      fullWidth
                      SelectProps={{
                        native: true,
                      }}
                      value={volume.mode}
                      onChange={(event) => {
                        const updatedVolumes = [...values.volumes];
                        updatedVolumes[index] = {
                          ...updatedVolumes[index],
                          mode: event.target.value,
                        };
                        setValues({
                          ...values,
                          volumes: updatedVolumes,
                        });
                      }}
                    >
                      <option value={"rw"}>Read/Write</option>
                      <option value={"ro"}>Read-Only</option>
                    </TextField>
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
          <Button
            onClick={() => {
              handleConfirmation(values);
            }}
            color="primary"
          >
            Run Container
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default NewContainerDialog;
