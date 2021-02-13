import React, { KeyboardEvent, ChangeEvent } from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";

type HardiskSectionProps = {
  blkioweightValue: { [value: string]: number };
  blkioweightOnChange: (event: ChangeEvent<any>) => void;
};

function HardiskSection({
  blkioweightValue,
  blkioweightOnChange,
}: HardiskSectionProps) {
  function handleKeyPress(event: KeyboardEvent<any>) {
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
      <Grid item xs={12} style={{ padding: "2px", paddingLeft: "12px" }}>
        <Typography variant="subtitle2">Harddisk</Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          variant="outlined"
          label="blkio weight"
          type="number"
          fullWidth
          onKeyDown={handleKeyPress}
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
