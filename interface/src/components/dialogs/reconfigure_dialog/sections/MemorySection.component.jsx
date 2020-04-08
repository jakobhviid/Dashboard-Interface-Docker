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

  return (
    <React.Fragment>
      <Grid item xs={12} style={{ padding: "2px", paddingLeft: "12px" }}>
        <Typography variant="subtitle2">Memory</Typography>
      </Grid>
      <Grid item xs={8}>
        <TextField
          variant="outlined"
          label="memory limit"
          type="number"
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
          label="memory reservation"
          type="number"
          fullWidth
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
