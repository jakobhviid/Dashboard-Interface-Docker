import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";

function HardiskSection({ blkioweightValue, blkioweightOnChange }) {
  return (
    <React.Fragment>
      <Grid item xs={12} style={{ padding: "2px", paddingLeft: "12px" }}>
        <Typography variant="subtitle2">Harddisk</Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          variant="outlined"
          label="blkio weight"
          type="number"
          fullWidth
          InputProps={{ inputProps: { step: 10 } }}
          value={blkioweightValue}
          onChange={blkioweightOnChange}
          helperText="blkio_weight ranges between 10 and 1000"
        />
      </Grid>
    </React.Fragment>
  );
}
export default HardiskSection;
