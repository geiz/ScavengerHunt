import React from "react";
import { withStyles } from "@material-ui/core/styles";
import firebase from "firebase";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Typography from "@material-ui/core/Typography";

import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";

/*
import AccountCircle from "@material-ui/icons/AccountCircle";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";*/

//For Drawer List
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DateIcon from "@material-ui/icons/DateRange";
import ChatIcon from "@material-ui/icons/Chat";
import ManageListings from "@material-ui/icons/BorderColor";
import CreateListing from "@material-ui/icons/AddBox";

import AccountIcon from "@material-ui/icons/AccountCircle";

import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";

const styles = {
  root: {
    flexGrow: 1
  },
  flex: {
    flex: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  }
};

class HeaderBar extends React.Component {
  constructor() {
    super();
    this.state = {
      left: false,
      user: {
        displayName: null,
        email: null,
        emailVerified: null,
        photoURL: null,
        uid: null,
        phoneNumber: null,
        accessToken: null,
        providerData: null
      },
      userToken: ""
    };

    this.userAccessToken = "";
  }

  componentDidMount() {
    this.provider = new firebase.auth.GoogleAuthProvider();

    //Listens for login and whatnot
    firebase.auth().onAuthStateChanged(
      result => {
        if (result) {
          console.log("onAuthStateChanged:", result);
          this.setState({
            user: {
              displayName: result.displayName,
              email: result.email,
              emailVerified: result.emailVerified,
              photoURL: result.photoURL,
              uid: result.uid,
              phoneNumber: result.phoneNumber,
              providerData: result.providerData
            }
          });

          result.getIdToken().then(accessToken => {
            var newUserData = { ...this.state.user };
            newUserData.accessToken = accessToken;
            this.setState({ user: newUserData });
          });
        } else {
          // User is signed out.
          console.log("User is not signed in");
        }
      },
      function(error) {
        console.log(error);
      }
    );
  }

  goToURL = (e, url) => {
    e.preventDefault();
    this.props.history.push(url);
  };

  goToHome = e => {
    e.preventDefault();
    this.props.history.push(`/`);
  };

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open
    });
  };

  listingItems = (
    <div>
      <ListItem
        button
        href="/createnewlisting"
        onClick={e => this.goToURL(e, `/createnewlisting/`)}
      >
        <ListItemIcon>
          <CreateListing />
        </ListItemIcon>
        <ListItemText primary="Create Your Hunt!" />
      </ListItem>
    </div>
  );

  signInGoogle = () => {
    console.log("signInGoogle Called");
    firebase
      .auth()
      .signInWithPopup(this.provider)
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
        console.log(error);
      });
  };

  signOutUser = () => {
    firebase
      .auth()
      .signOut()
      .then(function() {
        // Sign-out successful.
        console.log("signed out successfully");
      })
      .catch(function(error) {
        // An error happened.
        console.log("Sign Out Issue: ", error);
      });
  };

  render() {
    const sideList = (
      <div>
        <List>{this.listingItems}</List>
      </div>
    );

    return (
      <div style={styles.root}>
        <AppBar
          position="static"
          style={{ background: "transparent", boxShadow: "none" }}
        >
          <Toolbar>
            <IconButton
              onClick={this.toggleDrawer("left", true)}
              color="inherit"
              aria-label="Menu"
            >
              <MenuIcon />
            </IconButton>
            <Typography
              align="center"
              variant="title"
              size="large"
              color="inherit"
              style={styles.flex}
              onClick={e => this.goToHome(e)}
            >
              Scavenger Hunt!
            </Typography>
            <Button
              variant="flat"
              color="inherit"
              onClick={() => this.signInGoogle()}
            >
              Sign Up
            </Button>
          </Toolbar>
        </AppBar>

        <Drawer
          open={this.state.left}
          onClose={this.toggleDrawer("left", false)}
        >
          <div
            tabIndex={0}
            role="button"
            onClick={this.toggleDrawer("left", false)}
            onKeyDown={this.toggleDrawer("left", false)}
          >
            {sideList}
          </div>
        </Drawer>
      </div>
    );
  }
}
//Google Button
/* 
<button
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              onClick={() => this.signInGoogle()}
            >
              <span>
                <img
                  alt=""
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                />
              </span>
              <span id="user">Not Logged In</span>
            </button> */
export default withStyles(styles)(HeaderBar);
