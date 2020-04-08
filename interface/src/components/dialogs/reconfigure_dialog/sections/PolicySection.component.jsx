import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";

function RestartPolicySection({
  restartValue,
  restartNameOnChange,
  restartRetryCountOnChange,
  headerInvisible,
}) {
  return (
    <React.Fragment>
      {headerInvisible ? null : (
        <Grid item xs={12} style={{ padding: "2px", paddingLeft: "12px" }}>
          <Typography variant="subtitle2">Container Exit Actions</Typography>
        </Grid>
      )}
      <Grid item xs={8}>
        <TextField
          select
          fullWidth
          variant="outlined"
          label="Restart Policy"
          value={restartValue.name}
          onChange={restartNameOnChange}
          SelectProps={{
            native: true,
          }}
          helperText="When to restart container if it exits"
        >
          <option value={"{}"}>None</option>
          <option value={"on-failure"}>Restart On Failure Exit Code</option>
          <option value={"always"}>Restart Always On exist</option>
        </TextField>
      </Grid>
      <Grid item xs={4}>
        <TextField
          type="number"
          variant="outlined"
          label="Retry Count"
          value={restartValue.maximumRetryCount}
          onChange={restartRetryCountOnChange}
          SelectProps={{
            native: true,
          }}
          helperText="Number of times to restart the container on failure"
        ></TextField>
      </Grid>
    </React.Fragment>
  );
}
export default RestartPolicySection;
