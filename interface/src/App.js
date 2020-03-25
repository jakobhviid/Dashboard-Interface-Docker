import React, { lazy, Suspense } from "react";
import { Switch, Route } from "react-router-dom";

import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import LinearProgress from "@material-ui/core/LinearProgress";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";

import Header from "./components/header/Header.component";
import Footer from "./components/footer/Footer.component";
import { OVERVIEW_URL, RESSOURCE_USAGE_URL } from "./util/navigationEndpoints";

import useStyles from "./App.styles";
const Overview = lazy(() => import("./pages/overview_page/Overview.page"));
const RessourceUsage = lazy(() =>
  import("./pages/ressource_usage_page/RessourceUsage.page")
);

const theme = createMuiTheme({
  palette: {
    primary: { main: "#37474f" },
    secondary: { main: "#1976d2" },
    error: { main: "#b71c1c" }
  }
});

function App() {
  const styleClasses = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <div className={styleClasses.root}>
        <CssBaseline />
        <Header />
        <Switch>
          <Suspense fallback={<LinearProgress color="secondary" />}>
            <main className={styleClasses.content}>
              <div className={styleClasses.appBarSpacer} />
              <Container maxWidth="lg" className={styleClasses.container}>
                <Route exact path={OVERVIEW_URL} component={Overview} />
                <Route path={RESSOURCE_USAGE_URL} component={RessourceUsage} />
                {/* <Footer /> */}
              </Container>
            </main>
          </Suspense>
        </Switch>
      </div>
    </ThemeProvider>
  );
}

export default App;
