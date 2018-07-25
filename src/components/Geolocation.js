import React from "react";
import { geolocated } from "react-geolocated";
import RenderMap from "./RenderMap";
import "../css/Geolocation.css";

class Geolocation extends React.Component {
  render() {
    return !this.props.isGeolocationAvailable ? (
      <div className="geolocation">
        Your browser does not support Geolocation
      </div>
    ) : !this.props.isGeolocationEnabled ? (
      <div className="geolocation">
        <div>Geolocation is not enabled.</div>
      </div>
    ) : this.props.coords ? (
      <div className="geolocation">
        <RenderMap
          latitude={this.props.coords.latitude}
          longitude={this.props.coords.longitude}
          target="map"
          setLongLat={this.props.setLongLat}
        />
      </div>
    ) : (
      <div className="geolocation">Getting the location data&hellip; </div>
    );
  }
}

export default geolocated({
  positionOptions: {
    enableHighAccuracy: false
  },
  userDecisionTimeout: 100
})(Geolocation);
