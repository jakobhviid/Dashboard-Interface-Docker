import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";

function CpuSection({
  cpuShares,
  cpuSharesOnChange,
  cpuPeriod,
  cpuPeriodOnChange,
  cpuQuota,
  cpuQuotaOnChange,
  cpusetCpus,
  cpusetCpusOnChange,
  cpusetMems,
  cpusetMemsOnChange,
}) {
  return (
    <React.Fragment>
      <Grid item xs={12} style={{ padding: "2px", paddingLeft: "12px" }}>
        <Typography variant="subtitle2">CPU Usage</Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          variant="outlined"
          label="CPU Set"
          type="text"
          fullWidth
          value={cpusetCpus}
          onChange={cpusetCpusOnChange}
          helperText="CPUs in which to allow execution example: (0-3) or (0,1)"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          variant="outlined"
          label="CPU Shares"
          type="number"
          fullWidth
          InputProps={{ inputProps: { step: 10 } }}
          value={cpuShares}
          onChange={cpuSharesOnChange}
          helperText="Soft CPU shares (relative weight)"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          variant="outlined"
          label="CPU Period"
          type="number"
          fullWidth
          value={cpuPeriod}
          onChange={cpuPeriodOnChange}
          helperText="Limit CPU CFS (Completly Fair Scheduler) period"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          variant="outlined"
          label="CPU Quota"
          type="number"
          fullWidth
          value={cpuQuota}
          onChange={cpuQuotaOnChange}
          helperText="Limit CPU CFS (Completly Fair Scheduler) quota."
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          variant="outlined"
          label="CPU Memory Nodes"
          type="text"
          fullWidth
          value={cpusetMems}
          onChange={cpusetMemsOnChange}
          helperText="Memory nodes (MEMs) in which to allow execution (0-3, 0,1). Only effective on NUMA systems."
        />
      </Grid>
    </React.Fragment>
  );
}
export default CpuSection;
