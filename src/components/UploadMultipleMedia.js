import React from "react";
import "../css/UploadMultipleMedia.css";

import photoicon from "../img/photoicon.png";

// Takes in Props: setImageState, getImageState
// the image state should start empty like "image: {}"
class UploadMultipleMedia extends React.Component {
  componentDidMount() {}
  // Reads a single file.
  // takes in an agument from e.target.files[0]
  readSingleFileToState = (file, i) => {
    var reader = new FileReader();
    var dataURL;
    reader.onload = () => {
      dataURL = reader.result;
      this.props.setMediaState(dataURL, i, file.name, file.type);
    };
    reader.readAsDataURL(file);
  };

  handleFiles = e => {
    e.persist();
    var allFiles = e.target.files;
    for (let i = 0; i < allFiles.length; i++) {
      this.readSingleFileToState(allFiles[i], i);
    }
  };

  /*createPreview = index => {
    return (
      <img
        className="UMI-preview"
        src={this.props.getMediaState()[index]}
        key={index}
        alt="img"
      />
    );
  };*/

  createPreview = index => {
    const image = this.props.getMediaState()[`${index}`].media;
    return (
      <div className="UMM-preview" key={index}>
        <img src={image} alt={index.toString()} />
      </div>
    );
  };

  render() {
    return (
      <div className="UMM">
        <label className="custom-file-upload">
          <img src={photoicon} alt={photoicon} key={photoicon} />
          <input
            type="file"
            //accept="video/*,image/*"
            accept="image/*"
            onChange={this.handleFiles}
            multiple
          />
        </label>
        {this.props.getMediaState() !== null
          ? Object.keys(this.props.getMediaState()).map(key =>
              this.createPreview(key)
            )
          : console.log("nope, it's empty")}
      </div>
    );
  }
}
/*{this.props.getMediaState()
          ? this.props
              .getMediaState()
              .map((val, index) => this.createPreview(index))
          : console.log("nope, it's empty")}*/
/*{this.props.getMediaState() !== null
            ? Object.keys(this.props.getMediaState()).forEach(key =>
                this.createPreview(key)
              )
            : console.log("nope, it's empty")}*/

export default UploadMultipleMedia;
