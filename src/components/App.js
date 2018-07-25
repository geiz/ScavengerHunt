import React from "react";
import "../css/App.css";
import { makeId, cleanArray, validURL } from "../helpers";
import HeaderBar from "./HeaderBar";
import firebase from "firebase";
import { baseStorage, baseDatabase } from "../base";

import AppRenderMap from "./AppRenderMap";
import { geolocated } from "react-geolocated";

import { withStyles } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import GridList from "@material-ui/core/GridList";
import Button from "@material-ui/core/Button";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import ListSubheader from "@material-ui/core/ListSubheader";
import IconButton from "@material-ui/core/IconButton";
import InfoIcon from "@material-ui/icons/Info";
import Typography from "@material-ui/core/Typography";

const styles = theme => ({
  suggestionsContainerOpen: {
    position: "absolute",
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0
  },
  suggestion: {
    display: "block"
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: "none"
  },

  fontSize: "large"
});

class App extends React.Component {
  // set as a property instead of a method so "this" gets auto binded
  constructor(props) {
    super(props);

    this.state = {
      long: 0,
      lat: 0,
      shEvents: {
        0: {
          long: -79.8317042,
          lat: 43.7618222
        },
        1: {
          long: -79.828159,
          lat: 43.7622162
        }
      },
      localEvents: {},
      eventId: "",
      eventName: "",
      eventSERP: "",
      eventImg: "",
      isLoaded: false
    };
  }

  componentDidMount() {
    this.storageRef = baseStorage.ref();

    this.listingID = "";

    var searchSnapShot;
    searchSnapShot = baseDatabase
      .ref("/listers/")
      .orderByChild("category")
      .equalTo("sh")
      .once("value")
      .then(result => {
        if (result.val() !== null) {
          //const resultVal = cleanArray(result.val());
          this.setState({
            localEvents: result.val(),
            isLoaded: true
          });
        }
      });
  }

  getStoredImage = ref => {
    if (validURL(ref)) {
      console.log(ref, "ref");
      return ref;
    } else {
      console.log(ref, "else triggered");
      this.storageRef
        .child("images/" + ref) // if not a direct link, it is a firebase image
        .getDownloadURL()
        .then(url => {
          // Insert url into an <img> tag to "download"
          console.log(url, "url");
          this.setState({ eventImg: url });
        })
        .catch(function(error) {
          console.log("error triggered", error);
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case "storage/object_not_found":
              // File doesn't exist
              console.log("File doesn't exist");
              break;
            case "storage/unauthorized":
              // User doesn't have permission to access the object
              console.log("User doesn't have permission to access the object");
              break;
            case "storage/canceled":
              // User canceled the upload
              console.log("User canceled the upload");
              break;
            default:
              // Unknown error occurred, inspect the server response
              console.log(
                "Unknown error occurred, inspect the server response"
              );
              break;
          }
        });
    }
  };

  setEventName = name => {
    this.setState({ eventName: name });
  };
  setEventSERP = SERP => {
    this.setState({ eventSERP: SERP });
  };

  setEventId = id => {
    this.setState({ eventId: id });
  };

  getEventId = () => {
    return this.state.eventId;
  };
  getLocalEvents = () => {
    return this.state.localEvents;
  };

  setLongLat = (long, lat) => {
    var newLong = { ...this.state.long };
    var newLat = { ...this.state.lat };
    newLong = long;
    newLat = lat;
    this.setState({ newLong, newLat }, () => console.log());
  };

  getLongLat = () => {
    return this.state.report.pos;
  };

  goToFound = e => {
    e.preventDefault();
    const foundId = makeId();
    this.props.history.push(`/found/${foundId}`);
  };

  displaySearchResults = index => {
    var result = this.state.localEvents[`${index}`];
    console.log(result, "result");
    return (
      <GridListTile key={index}>
        <img
          id={"<img/>" + index}
          src={this.getStoredImage(result.logo, "<img/>" + index)}
          alt={result.name}
        />
        <GridListTileBar
          title={result.name}
          subtitle={<span>{result.serpText}</span>}
          actionIcon={
            <IconButton
              onClick={() => {
                console.log("clicked info");
              }}
            >
              <InfoIcon />
            </IconButton>
          }
        />
      </GridListTile>
    );
  };

  render() {
    const style = {
      width: "20vw",
      fontSize: "large"
    };

    return !this.props.isGeolocationAvailable ? (
      <div className="App">Your browser does not support Geolocation</div>
    ) : !this.props.isGeolocationEnabled ? (
      <div className="App">
        <header className="Scavenger Hunt" />
        <AppRenderMap longitude={43} latitude={-30} target="AppMap" />
        <footer>
          <button className="App-report-button" onClick={this.goToReportType}>
            No location data
          </button>
        </footer>
      </div>
    ) : this.props.coords ? (
      <div className="App">
        <HeaderBar history={this.props.history} />
        {!this.state.isLoaded ? (
          console.log("not")
        ) : (
          <AppRenderMap
            longitude={this.props.coords.longitude}
            latitude={this.props.coords.latitude}
            target="AppMap"
            shEvents={this.state.shEvents}
            localEvents={this.state.localEvents}
            getLocalEvents={this.state.getLocalEvents}
            setEventId={this.setEventId}
            getEventId={this.getEventId}
            setEventName={this.setEventName}
            setEventSERP={this.setEventSERP}
            getStoredImage={this.getStoredImage}
          />
        )}

        <footer>
          <div className="footerWrapper">
            {this.props.match.params.foundId ? (
              <Typography color="inherit" variant="body2">
                {this.props.match.params.foundId} has been sent successfully
              </Typography>
            ) : (
              <h2 />
            )}
            <Button
              variant="raised"
              color="primary"
              size="large"
              onClick={this.goToFound}
              style={style}
            >
              I found it!
            </Button>

            <Typography color="inherit" variant="subheading">
              {this.state.eventName}
            </Typography>
            <Typography color="inherit" variant="body1">
              {this.state.eventSERP}
            </Typography>
            <img
              src={this.state.eventImg || null}
              style={{ height: "10em", width: "10em" }}
            />
          </div>
        </footer>
      </div>
    ) : (
      <div>Getting the location data&hellip; </div>
    );
  }
}
// <Typography color="secondary">{this.state.eventId}</Typography>
/*{this.state.eventId !== ""
? console.log()
: this.state.localEvents[`${this.state.eventId}`]}*/

/* {this.state.eventId !== -1
            ? console.log()
            : !this.state.isLoaded
              ? console.log
              : this.displaySearchResults(this.state.eventId)}
              */

export default geolocated({
  positionOptions: {
    enableHighAccuracy: false
  },
  userDecisionTimeout: 5000
})(App);
