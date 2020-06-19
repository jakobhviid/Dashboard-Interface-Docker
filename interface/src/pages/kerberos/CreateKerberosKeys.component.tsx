import React, { useState, FormEvent } from "react";
import { useDispatch } from "react-redux";

import useStyles from "./Kerberos.styles";
import { enqueueSnackbar } from "../../redux/notifier/notifier.actions";
import { Typography, Grid, TextField, Button, FormControlLabel, Checkbox } from "@material-ui/core";
import { downloadKeytab, IDownloadKeyTabBody } from "../../api/kerberosRequests";
import { downloadBlob } from "../../util/helpers";

function CreateKerberosKeys() {
  const [kerberosUrl, setKerberosUrl] = useState<string>("");
  const [adminPassword, setAdminPassword] = useState("");
  const [kerberosName, setKerberosName] = useState("");
  const [kerberosPassword, setKerberosPassword] = useState("");
  const [kerberosHost, setKerberosHost] = useState("");
  const [downloadKeyTabDirectly, setDownloadKeyTabDirectly] = useState(true);

  const classes = useStyles();
  const dispatch = useDispatch();

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (kerberosUrl === "" || adminPassword === "" || kerberosName === "" || kerberosPassword === "") {
      dispatch(
        enqueueSnackbar({
          message: "Fill out all required fields * ",
          options: { key: new Date().getTime() + Math.random(), persist: false, variant: "error" },
        })
      );
      return;
    }
    let url: string = "";
    let postBody: any = { adminPassword };

    if (kerberosHost !== "") {
      url = kerberosUrl + "/create-new-service";
      postBody["adminPassword"] = adminPassword;
      postBody["newServiceName"] = kerberosName;
      postBody["newServicePassword"] = kerberosPassword;
      if (kerberosHost !== "") postBody["newServiceHost"] = kerberosHost;
    } else {
      url = kerberosUrl + "/create-new-user";
      postBody["newUserUsername"] = kerberosName;
      postBody["newUserPassword"] = kerberosPassword;
    }

    fetch(url, {
      method: "post",
      body: JSON.stringify(postBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        var successful = !data.status.toString().startsWith("4");
        dispatch(
          enqueueSnackbar({
            message: data.message,
            options: {
              key: new Date().getTime() + Math.random(),
              persist: false,
              variant: successful ? "success" : "error",
            },
          })
        );
        return successful;
      })
      .then((successful) => {
        if (successful && downloadKeyTabDirectly) {
          const postBody: IDownloadKeyTabBody = { username: kerberosName, password: kerberosPassword };
          if (kerberosHost !== "") {
            postBody["host"] = kerberosHost;
          }

          downloadKeytab(kerberosUrl, postBody)
            .then((keytab) => {
              var name = kerberosName + ".keytab";
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
      })
      .catch((error) => {
        console.log(error);

        dispatch(
          enqueueSnackbar({
            message: "Kerberos URL invalid",
            options: { key: new Date().getTime() + Math.random(), persist: false, variant: "error" },
          })
        );
      });
  }

  return (
    <div className={classes.formContainer}>
      <Typography component="h1" variant="h5">
        Create Kerberos User / Service
      </Typography>
      <form className={classes.form} noValidate onSubmit={onSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              helperText="The Kerberos URL to create user / service on - (example: http://127.0.0.1:3000)"
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
              helperText="Only the administrator of the kerberos server can create new kerberos users / services"
              variant="outlined"
              required
              fullWidth
              value={adminPassword}
              id="adminpassword"
              label="Kerberos Admin Password"
              name="adminPassword"
              autoComplete="off"
              type="password"
              onChange={(event) => setAdminPassword(event.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              helperText="Name which the user / service will be identified by"
              variant="outlined"
              required
              fullWidth
              id="name"
              autoComplete="off"
              value={kerberosName}
              label="Keytab Name"
              name="name"
              onChange={(event) => setKerberosName(event.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              helperText="Password which the user / service will use to get their keytab"
              autoComplete="off"
              variant="outlined"
              required
              fullWidth
              name="password"
              label="Keytab Password"
              type="password"
              id="password"
              value={kerberosPassword}
              onChange={(event) => setKerberosPassword(event.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              helperText="Host which the user / service can use their keytab from. This is not required"
              autoComplete="off"
              variant="outlined"
              fullWidth
              name="url"
              label="Keytab Host"
              type="url"
              id="url"
              onChange={(event) => setKerberosHost(event.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  value="downloadKeytab"
                  color="secondary"
                  checked={downloadKeyTabDirectly}
                  onChange={(event) => setDownloadKeyTabDirectly(event.target.checked)}
                />
              }
              label="Download Keytab After Creation"
            />
          </Grid>
        </Grid>
        <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
          Create kerberos user / service
        </Button>
      </form>
    </div>
  );
}

export default CreateKerberosKeys;
