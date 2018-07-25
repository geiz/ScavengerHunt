import React from "react";
import { dataURItoBlob } from "../helpers";
import firebase from "firebase";

import UploadMultipleMedia from "./UploadMultipleMedia";
import { makeId } from "../helpers";

import "../css/CreateNewListing.css";

import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import GridList from "@material-ui/core/GridList";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import SearchIcon from "@material-ui/icons/Search";
import LocationOn from "@material-ui/icons/LocationOn";

import HeaderBar from "./HeaderBar";
import Geolocation from "./Geolocation";

const style = {
  t: {
    width: "50vw"
  },
  width: "60vw",
  fontSize: "large"
};

class Found extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      createdListing: {
        email: "e",
        name: "e"
      },
      imgPreview: [],
      uploadStatus: "Not Uploaded"
    };
  }

  componentDidMount() {
    //Create Reference to Media Storage
    this.storageRef = firebase.storage().ref();

    //Create Reference to Text Data Storage
    this.database = firebase.database();
  }

  submitPhoto = e => {
    e.preventDefault();
    this.props.history.push(`/success/It`);
  };

  setLongLat = (long, lat) => {
    var newPos = { ...this.state.createdListing.pos };
    newPos.long = long;
    newPos.lat = lat;
    this.setState({ createdListing: { pos: newPos } }, () => console.log());
  };

  getLongLat = () => {
    return this.state.createdListing.pos;
  };

  setMediaState = (media, index, fileName, fileType) => {
    var newMedia = { ...this.state.imgPreview };
    newMedia[`${index}`] = { media: media, name: fileName, type: fileType };
    this.setState({ imgPreview: newMedia });
  };

  getMediaState = () => {
    return this.state.imgPreview;
  };

  uploadFileToServer = (fileName, data, metadata) => {
    this.uploadUserData();
    // File or Blob named mountains.jpg
    var file = dataURItoBlob(data);

    // Create the file metadata
    var metadata = {
      contentType: "image/jpeg"
    };

    // Upload file and metadata to the object 'images/mountains.jpg'
    var uploadTask = this.storageRef
      .child("selfies/" + this.state.createdListing.email + "/" + fileName)
      .put(file, metadata);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
      function(snapshot) {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log("Upload is paused");
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log("Upload is running");
            break;
        }
      },
      error => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case "storage/unauthorized":
            // User doesn't have permission to access the object
            break;

          case "storage/canceled":
            // User canceled the upload
            break;

          case "storage/unknown":
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
          console.log("File available at", downloadURL);
        });
        this.setState({ uploadStatus: "It's Uploaded" });
      }
    );
  };

  uploadUserData = () => {
    this.database.ref("hunters/" + `${this.state.name}`).set({
      logo: this.state.email + "/" + this.state.imgPreview[0].name,
      name: this.state.name,
      category: "found"
    });
  };

  onSignIn = googleUser => {
    var profile = googleUser.getBasicProfile();
    console.log("ID: " + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log("Name: " + profile.getName());
    console.log("Image URL: " + profile.getImageUrl());
    console.log("Email: " + profile.getEmail()); // This is null if the 'email' scope is not present.
  };

  handleChange = prop => event => {
    this.setState({ [prop]: event.target.value });
  };

  render() {
    const responseGoogle = response => {
      console.log(response);
    };

    return (
      <div>
        <HeaderBar history={this.props.history} />
        <FormControl>
          <div className="formInputContainer">
            <Input
              placeholder="Name name?"
              style={style}
              autoFocus={true}
              onChange={this.handleChange("name")}
            />
          </div>
          <div className="formInputContainer">
            <Input
              placeholder="Your Email?"
              style={style}
              autoFocus={true}
              onChange={this.handleChange("email")}
            />
          </div>
          <div className="formInputContainer">
            <Typography color="secondary" variant="title">
              Upload Your Selfie with the item to win!
            </Typography>
          </div>

          <UploadMultipleMedia
            setMediaState={this.setMediaState}
            getMediaState={this.getMediaState}
          />

          <div className="formInputContainer">
            <Typography color="secondary" variant="body1">
              {this.state.uploadStatus}
            </Typography>
            <Button
              variant="raised"
              color="primary"
              onClick={e => {
                this.state.imgPreview.length !== 0
                  ? this.uploadFileToServer(
                      this.state.imgPreview[0].name,
                      this.state.imgPreview[0].media,
                      this.state.imgPreview[0].type
                    )
                  : console.log("nope, it's empty");
              }}
              style={{ margin: "2em" }}
            >
              Upload Single Photo
            </Button>
            <Button variant="raised" color="primary" onClick={this.submitPhoto}>
              Submit
            </Button>
          </div>
        </FormControl>
      </div>
    );
  }
}

export default Found;
