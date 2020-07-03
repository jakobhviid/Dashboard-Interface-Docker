import React, { lazy, Suspense } from "react";
import { Switch, Route } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import { useDispatch } from "react-redux";

import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import LinearProgress from "@material-ui/core/LinearProgress";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";

import Header from "./components/header/Header.component";
import { OVERVIEW_URL, RESSOURCE_USAGE_URL, LOGIN_URL, KERBEROS_URL } from "./util/navigationEndpoints";

import useStyles from "./App.styles";
import Notifier from "./components/notifier/Notifier.component";
import { closeSnackbar } from "./redux/notifier/notifier.actions";

import {
  dataCollectionStart, stopCollectingOverview, stopCollectingRessources, stopListeningForCommandResponses,
} from "./redux/container_data/containerData.effects";
import { useTypedSelector, IRootState } from "./types/redux/reducerStates.types";
import { loadAndTestJwtLocalStorage } from "./util/reduxHelpers";
import { loginWithJwt } from "./redux/user/user.actions";
import { hubConnectionInitialization, hubConnectionOff } from "./redux/container_data/containerData.actions";

const Overview = lazy(() => import("./pages/overview_page/Overview.page"));
const RessourceUsage = lazy(() => import("./pages/ressource_usage_page/RessourceUsage.page"));
const Login = lazy(() => import("./pages/login/Login.page"));
const Kerberos = lazy(() => import("./pages/kerberos/Kerberos.page"));

const theme = createMuiTheme({
  palette: {
    primary: { main: "#37474f" },
    secondary: { main: "#1976d2" },
    error: { main: "#b71c1c" },
  },
});

function App() {
  const dispatch = useDispatch();
  const styleClasses = useStyles();
  const socketConnection = useTypedSelector((store:IRootState) => store.containerData.socketConnection);

  React.useEffect(() => {
    const jwt = loadAndTestJwtLocalStorage();
    if (typeof jwt === "string") {
      dispatch(loginWithJwt(jwt, true));
      dispatch(hubConnectionInitialization(jwt));
      dispatch(dataCollectionStart());
    }
    return () => {
      if (socketConnection !== undefined) {
        dispatch(stopCollectingOverview());
        dispatch(stopCollectingRessources());
        dispatch(stopListeningForCommandResponses());
        dispatch(hubConnectionOff())
      }
    }
  }, [dispatch]);

  return (
    <SnackbarProvider
      maxSnack={2}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      dense
      preventDuplicate
      hideIconVariant
      action={(key) => (
        <IconButton aria-label="close notification" onClick={() => dispatch(closeSnackbar(key))}>
          <ClearIcon />
        </IconButton>
      )}
    >
      <ThemeProvider theme={theme}>
        <Notifier />
        <div className={styleClasses.root}>
          <CssBaseline />
          <Header />
          <Switch>
            <Suspense fallback={<LinearProgress color="secondary" />}>
              <main className={styleClasses.content}>
                <div className={styleClasses.appBarSpacer} />
                <Container maxWidth="xl" className={styleClasses.container}>
                  <Route exact path={OVERVIEW_URL} component={Overview} />
                  <Route path={RESSOURCE_USAGE_URL} component={RessourceUsage} />
                  <Route path={LOGIN_URL} component={Login} />
                  <Route path={KERBEROS_URL} component={Kerberos} />
                </Container>
              </main>
            </Suspense>
          </Switch>
        </div>
      </ThemeProvider>
    </SnackbarProvider>
  );
}

export default App;
