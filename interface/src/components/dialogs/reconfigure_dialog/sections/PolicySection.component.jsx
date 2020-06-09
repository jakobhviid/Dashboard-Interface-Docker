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
  function handleKeyPress(event) {
    // Test for comma and punctuation and for 'e' which for some reason goes through as a number?
    // Comma numpad, multiply, divide, minus, plus signs and a lot of other edge cases which html forms doesn't take proper care of
    const keysToCheck = [188, 190, 69, 110, 187, 106, 109, 107, 221, 189];
    const key = event.keyCode;
    if (keysToCheck.includes(key)) {
      event.preventDefault();
    }
  }
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
          value={restartValue.restartPolicy}
          onChange={restartNameOnChange}
          SelectProps={{
            native: true,
          }}
          helperText="When to restart container if it exits"
        >
          <option value="none">None</option>
          <option value="always">Restart Always On exit</option>
          <option value="onFailure">Restart On Failure Exit</option>
          <option value="unlessStopped">Restart Unless Stopped</option>
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
          onKeyDown={handleKeyPress}
          helperText="Number of times to restart the container on failure"
        ></TextField>
      </Grid>
    </React.Fragment>
  );
}
export default RestartPolicySection;
