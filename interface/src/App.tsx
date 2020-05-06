import React, { lazy, Suspense } from "react";
import { Switch, Route } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import { useDispatch, useSelector } from "react-redux";

import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import LinearProgress from "@material-ui/core/LinearProgress";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";

import Header from "./components/header/Header.component";
import { OVERVIEW_URL, RESSOURCE_USAGE_URL } from "./util/navigationEndpoints";

import useStyles from "./App.styles";
import Notifier from "./components/notifier/Notifier.component";
import { closeSnackbar } from "./redux/notifier/notifier.actions";

import {
  startCollectingOverview,
  startCollectingRessources,
  stopCollectingOverview,
  stopCollectingRessources,
} from "./redux/container_data/containerData.effects";

const Overview = lazy(() => import("./pages/overview_page/Overview.page"));
const RessourceUsage = lazy(() =>
  import("./pages/ressource_usage_page/RessourceUsage.page")
);

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

  React.useEffect(() => {
    dispatch(startCollectingOverview());
    dispatch(startCollectingRessources());

    return () => {
      dispatch(stopCollectingOverview());
      dispatch(stopCollectingRessources());
    };
  }, [dispatch]);

  return (
    <SnackbarProvider
      maxSnack={2}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      dense
      preventDuplicate
      hideIconVariant
      action={(key) => (
        <IconButton
          aria-label="close notification"
          onClick={() => dispatch(closeSnackbar(key))}
        >
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
                  <Route
                    path={RESSOURCE_USAGE_URL}
                    component={RessourceUsage}
                  />
                  {/* <Footer /> */}
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
