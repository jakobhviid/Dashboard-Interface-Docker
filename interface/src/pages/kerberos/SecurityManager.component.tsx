import React, { useState, FormEvent } from "react";
import { useDispatch } from "react-redux";

import useStyles from "./Kerberos.styles";
import { enqueueSnackbar } from "../../redux/notifier/notifier.actions";
import { Typography, Grid, TextField, Button } from "@material-ui/core";
import { downloadKeytab, IDownloadKeyTabBody } from "../../api/kerberosRequests";
import { downloadBlob } from "../../util/helpers";

function SecurityManagerTab() {
  const [kerberosUrl, setKerberosUrl] = useState<string>("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [host, setHost] = useState("");

  const classes = useStyles();
  const dispatch = useDispatch();

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (kerberosUrl === "" || username === "" || password === "") {
      dispatch(
        enqueueSnackbar({
          message: "Fill out all required fields * ",
          options: { key: new Date().getTime() + Math.random(), persist: false, variant: "error" },
        })
      );
      return;
    }
    const postBody: IDownloadKeyTabBody = { username, password };
    if (host !== "") {
      postBody["host"] = host;
    }

    downloadKeytab(kerberosUrl, postBody)
      .then((keytab) => {
        var name = username + ".keytab";
        downloadBlob(keytab, name);
      })
      .catch((error) => {
        dispatch(
          enqueueSnackbar({
            message: error,
            options: { key: new Date().getTime() + Math.random(), persist: false, variant: "error" },
          })
        );
      });
  }

  return (
    <div className={classes.formContainer}>
      <Typography component="h1" variant="h5">
        Manage ACLs for Kafka & Zookeeper
      </Typography>
      TODO
    </div>
  );
}

export default SecurityManagerTab;
