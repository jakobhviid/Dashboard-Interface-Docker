import React, { lazy, Suspense, useEffect } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import LinearProgress from "@material-ui/core/LinearProgress";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";

import Header from "./components/header/Header.component";
import Footer from "./components/footer/Footer.component";

import useStyles from "./App.styles";
const Dashboard = lazy(() => import("./pages/dashboard_page/Dashboard.page"));

const theme = createMuiTheme({
  palette: {
    primary: { main: "#540796" },
    secondary: { main: "#4caf50" },
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
                <Route exact path="/" component={Dashboard} />
                <Footer />
              </Container>
            </main>
          </Suspense>
        </Switch>
      </div>
    </ThemeProvider>
  );
}

export default App;
