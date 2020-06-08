import React, { useState } from "react";
import { useDispatch } from "react-redux";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Container from "@material-ui/core/Container";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@material-ui/core";

import useStyles from "./Login.styles";
import { login } from "../../api/accountRequests";
import { enqueueSnackbar } from "../../redux/notifier/notifier.actions";
import { loginWithJwt } from "../../redux/user/user.actions";

function SignIn() {
  const [forgotPasswordEmailInput, setForgotPasswordEmailInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [forgotPasswordDialogOpen, setForgotPasswordDialogOpen] = useState(false);
  const dispatch = useDispatch();

  async function onLogInSubmit(event: any) {
    event.preventDefault();
    try {
      const loginResponse: string = await login(emailInput, passwordInput);
      dispatch(loginWithJwt(loginResponse));
    } catch (error) {
      // Error response
      dispatch(
        enqueueSnackbar({
          message: error.message,
          options: { key: new Date().getTime() + Math.random(), persist: false, variant: "error" },
        })
      );
    }
  }

  function onForgotPassword(event: any) {
    // TODO:
    console.log(forgotPasswordEmailInput);
  }

  const classes = useStyles();
  return (
    <Container maxWidth="xs">
      <div className={classes.formContainer}>
        <Avatar className={classes.formLoginIcon}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Log ind
        </Typography>
        <form
          onKeyPress={(event) => (event.key === "Enter" ? onLogInSubmit(event) : null)}
          className={classes.form}
          noValidate
          onSubmit={onLogInSubmit}
        >
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Adresse"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={(event) => setEmailInput(event.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Kodeord"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={(event) => setPasswordInput(event.target.value)}
          />
          <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Husk mig" />
          <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
            Log ind
          </Button>
          <Grid item xs>
            <Link onClick={() => setForgotPasswordDialogOpen(true)} variant="body2" style={{ cursor: "pointer" }}>
              Glemt kodeord?
            </Link>
          </Grid>
        </form>
        <Dialog
          open={forgotPasswordDialogOpen}
          onClose={() => setForgotPasswordDialogOpen(false)}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Glemt Kodeord</DialogTitle>
          <DialogContent>
            <DialogContentText>Få tilsendt en email hvor du kan sætte et nyt kodeord</DialogContentText>
            <TextField
              autoComplete="email"
              autoFocus
              margin="dense"
              id="name"
              label="Email adresse"
              type="email"
              fullWidth
              onChange={(event) => setForgotPasswordEmailInput(event.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setForgotPasswordDialogOpen(false)} color="primary">
              Annuller
            </Button>
            <Button onClick={(enteredEmail: any) => onForgotPassword(enteredEmail)} color="primary">
              Send
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </Container>
  );
}

export default SignIn;
