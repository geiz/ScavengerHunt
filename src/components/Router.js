import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import CssBaseline from "@material-ui/core/CssBaseline";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import purple from "@material-ui/core/colors/purple";

import App from "./App";
import Found from "./Found";
import Profile from "./Profile";
import Geolocation from "./Geolocation";
import CreateNewListing from "./CreateNewListing";

//We are developing the theme here.
const defaultTheme = createMuiTheme();
const myTheme = createMuiTheme({
  palette: {
    primary: {
      light: "#ffffff",
      main: "#fafafa",
      dark: "#c7c7c7",
      contrastText: "#263238"
    },
    secondary: {
      light: "#6ec6ff",
      main: "#2196f3",
      dark: "#0069c0",
      contrastText: "#fafafa"
    }
  }
});

// Because this is just returning other components, we can just create a function instead with implicit return.
const Router = () => (
  <React.Fragment>
    <CssBaseline />
    <MuiThemeProvider theme={myTheme}>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={App} />
          <Route exact path="/CreateNewListing" component={CreateNewListing} />
          <Route path="/success/:foundId" component={App} />
          <Route path="/found/:foundId" component={Found} />
          <Route path="/geolocation" component={Geolocation} />
          <Route component={App} />
        </Switch>
      </BrowserRouter>
    </MuiThemeProvider>
  </React.Fragment>
);

export default Router;
