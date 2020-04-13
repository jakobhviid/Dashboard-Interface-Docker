import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";

function MemorySection({
  memLimit,
  memLimitOnChange,
  memLimitByteVariantOnChange,
  memReservation,
  memReservationOnChange,
  memReservationByteVariantOnChange,
  memswapLimit,
  memswapLimitOnChange,
  memswapLimitByteVariantOnChange,
  kernelMemoryLimit,
  kernelMemoryLimitOnChange,
  kernelMemoryLimitByteVariantOnChange,
}) {
  const options = [
    { value: "kb", representation: "Kilobytes" },
    { value: "mb", representation: "Megabytes" },
    { value: "gb", representation: "Gigabytes" },
  ];

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
      <Grid item xs={12} style={{ padding: "2px", paddingLeft: "12px" }}>
        <Typography variant="subtitle2">Memory</Typography>
      </Grid>
      <Grid item xs={8}>
        <TextField
          variant="outlined"
          label="Memory limit"
          type="number"
          onKeyDown={handleKeyPress}
          fullWidth
          InputProps={{ inputProps: { step: 1000 } }}
          value={memLimit.value}
          onChange={memLimitOnChange}
          helperText="Limit Memory Usage for Container"
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
          variant="outlined"
          select
          label="Byte Variant"
          value={memLimit.byteVariant}
          onChange={memLimitByteVariantOnChange}
          SelectProps={{
            native: true,
          }}
          helperText="Please Select Byte Variant"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.representation}
            </option>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={8}>
        <TextField
          variant="outlined"
          label="Memory Swap Limit"
          type="number"
          fullWidth
          onKeyDown={handleKeyPress}
          InputProps={{ inputProps: { step: 1000 } }}
          value={memswapLimit.value}
          onChange={memswapLimitOnChange}
          helperText="Total Memory (memory + swap). Insert -1 to disable swap"
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
          variant="outlined"
          select
          label="Byte Variant"
          value={memswapLimit.byteVariant}
          onChange={memswapLimitByteVariantOnChange}
          SelectProps={{
            native: true,
          }}
          helperText="Please Select Byte Variant"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.representation}
            </option>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={8}>
        <TextField
          variant="outlined"
          label="Kernel Memory Limit"
          type="number"
          fullWidth
          onKeyDown={handleKeyPress}
          InputProps={{ inputProps: { step: 1000 } }}
          value={kernelMemoryLimit.value}
          onChange={kernelMemoryLimitOnChange}
          helperText="Limit kernel memory for container"
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
          variant="outlined"
          select
          label="Byte Variant"
          value={kernelMemoryLimit.byteVariant}
          onChange={kernelMemoryLimitByteVariantOnChange}
          SelectProps={{
            native: true,
          }}
          helperText="Please Select Byte Variant"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.representation}
            </option>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={8}>
        <TextField
          variant="outlined"
          label="Memory reservation"
          type="number"
          fullWidth
          onKeyDown={handleKeyPress}
          InputProps={{ inputProps: { step: 1000 } }}
          value={memReservation.value}
          onChange={memReservationOnChange}
          helperText="Limit Soft Memory Usage for Container"
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
          variant="outlined"
          select
          label="Byte Variant"
          value={memReservation.byteVariant}
          onChange={memReservationByteVariantOnChange}
          SelectProps={{
            native: true,
          }}
          helperText="Please Select Byte Variant"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.representation}
            </option>
          ))}
        </TextField>
      </Grid>
    </React.Fragment>
  );
}
export default MemorySection;
