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
      <form className={classes.form} noValidate onSubmit={onSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              helperText="The Kerberos URL to fetch keytab from - (example: http://127.0.0.1:3000)"
              name="Kerberos URL"
              variant="outlined"
              required
              fullWidth
              id="kerberosurl"
              label="Kerberos URL"
              type="url"
              value={kerberosUrl}
              autoComplete="off"
              autoFocus
              onChange={(event) => setKerberosUrl(event.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              helperText="Name which the user / service is identified by (username)"
              variant="outlined"
              required
              fullWidth
              id="name"
              autoComplete="off"
              value={username}
              label="Username"
              name="name"
              onChange={(event) => setUsername(event.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              autoComplete="off"
              variant="outlined"
              required
              fullWidth
              name="password"
              label="Keytab Password"
              type="password"
              id="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              helperText="Host which the user / service can use their keytab from. Not required"
              autoComplete="off"
              variant="outlined"
              fullWidth
              name="url"
              label="Keytab Host"
              type="url"
              id="url"
              onChange={(event) => setHost(event.target.value)}
            />
          </Grid>
        </Grid>
        <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
          Download Keytab
        </Button>
      </form>
    </div>
  );
}

export default SecurityManagerTab;
