import React from "react";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";

import HarddiskSection from "./sections/HarddiskSection.component";
import MemorySection from "./sections/MemorySection.component";
import RestartPolicySection from "./sections/PolicySection.component";
import CpuSection from "./sections/CPUSection.component";

function ReconfigureDialog({
  open,
  handleClose,
  handleConfirmation,
  dialogTitle,
}) {
  // TODO: change this when commando server has changed
  const [values, setValues] = React.useState({
    blkio_weight: "",
    mem_limit: { value: "", byteVariant: "mb" },
    mem_reservation: { value: "", byteVariant: "mb" },
    memswap_limit: { value: "", byteVariant: "mb" },
    kernel_memory: { value: "", byteVariant: "mb" },
    restart_policy: { name: "{}", maximumRetryCount: "" },
    cpu_shares: "",
    cpu_period: "",
    cpu_quota: "",
    cpuset_cpus: "",
    cpuset_mems: "",
  });

  function setblkio(event) {
    if (event.target.value <= 1000)
      setValues({ ...values, blkio_weight: event.target.value });
  }

  function setMemLimit(event) {
    setValues({
      ...values,
      mem_limit: { ...values.mem_limit, value: event.target.value },
    });
  }

  function setMemReservation(event) {
    setValues({
      ...values,
      mem_reservation: {
        ...values.mem_reservation,
        value: event.target.value,
      },
    });
  }

  function setMemSwapLimit(event) {
    setValues({
      ...values,
      memswap_limit: { ...values.memswap_limit, value: event.target.value },
    });
  }

  function setKernelMemoryLimit(event) {
    setValues({
      ...values,
      kernel_memory: { ...values.kernel_memory, value: event.target.value },
    });
  }

  function setRestartPolicy(event) {
    setValues({
      ...values,
      restart_policy: { ...values.restart_policy, name: event.target.value },
    });
  }

  function setRestartRetryCount(event) {
    setValues({
      ...values,
      restart_policy: {
        ...values.restart_policy,
        maximumRetryCount: event.target.value,
      },
    });
  }

  function sendValues() {
    const objectToSend = {};
    for (const key of Object.keys(values)) {
      if (
        values[key] !== "" &&
        values[key]["value"] !== "" &&
        values[key]["name"] !== "{}"
      ) {
        // memory field, need to add byteVariant
        if (values[key]["value"]) {
          objectToSend[key] = values[key]["value"] + values[key]["byteVariant"];
        } else if (values[key]["name"]) {
          objectToSend[key] = { Name: values[key]["name"] };
          if (values[key]["maximumRetryCount"] !== "")
            objectToSend[key]["MaximumRetryCount"] =
              values[key]["maximumRetryCount"];
        } else {
          try {
            objectToSend[key] = parseInt(values[key]);
          } catch (error) {
            // Value was not an integer, just pass it as a normal string
            objectToSend[key] = parseInt(values[key]);
          }
        }
      }
    }
    handleConfirmation(objectToSend);
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
      onKeyPress={(event) => (event.key === "Enter" ? sendValues() : null)}
    >
      <DialogTitle id="form-dialog-title">{dialogTitle}</DialogTitle>
      <DialogContent>
        <form noValidate autoComplete="off">
          <Grid container spacing={2}>
            <MemorySection
              memLimit={values.mem_limit}
              memLimitOnChange={(event) => setMemLimit(event)}
              memLimitByteVariantOnChange={(event) => {
                setValues({
                  ...values,
                  mem_limit: {
                    ...values.mem_limit,
                    byteVariant: event.target.value,
                  },
                });
              }}
              memReservation={values.mem_reservation}
              memReservationOnChange={(event) => setMemReservation(event)}
              memReservationByteVariantOnChange={(event) => {
                setValues({
                  ...values,
                  mem_reservation: {
                    ...values.mem_reservation,
                    byteVariant: event.target.value,
                  },
                });
              }}
              memswapLimit={values.memswap_limit}
              memswapLimitOnChange={(event) => setMemSwapLimit(event)}
              memswapLimitByteVariantOnChange={(event) => {
                setValues({
                  ...values,
                  memswap_limit: {
                    ...values.memswap_limit,
                    byteVariant: event.target.value,
                  },
                });
              }}
              kernelMemoryLimit={values.kernel_memory}
              kernelMemoryLimitOnChange={(event) => setKernelMemoryLimit(event)}
              kernelMemoryLimitByteVariantOnChange={(event) => {
                setValues({
                  ...values,
                  kernel_memory: {
                    ...values.kernel_memory,
                    byteVariant: event.target.value,
                  },
                });
              }}
            />
            <RestartPolicySection
              restartValue={values.restart_policy}
              restartNameOnChange={setRestartPolicy}
              restartRetryCountOnChange={setRestartRetryCount}
            />
            <CpuSection
              cpuShares={values.cpu_shares}
              cpuSharesOnChange={(event) => {
                setValues({ ...values, cpu_shares: event.target.value });
              }}
              cpuPeriod={values.cpu_period}
              cpuPeriodOnChange={(event) => {
                setValues({ ...values, cpu_period: event.target.value });
              }}
              cpuQuota={values.cpu_quota}
              cpuQuotaOnChange={(event) => {
                setValues({ ...values, cpu_quota: event.target.value });
              }}
              cpusetCpus={values.cpuset_cpus}
              cpusetCpusOnChange={(event) => {
                setValues({ ...values, cpuset_cpus: event.target.value });
              }}
              cpusetMems={values.cpuset_mems}
              cpusetMemsOnChange={(event) => {
                setValues({ ...values, cpuset_mems: event.target.value });
              }}
            />
            <HarddiskSection
              blkioweightValue={values.blkio_weight}
              blkioweightOnChange={(event) => setblkio(event)}
            />
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
        <Button onClick={sendValues} color="primary">
          Configure
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ReconfigureDialog;
