import React from "react";
import "../css/RenderMap.css";
// Have to Do this or ol won't work
import ol from "ol";
import Map from "ol/map";
import View from "ol/view";
import Tile from "ol/layer/tile";
import OSM from "ol/source/osm";
import Interaction from "ol/interaction";

// for creating the point
import VectorLayer from "ol/layer/vector";
import VectorSource from "ol/source/vector";
import Feature from "ol/feature";
import Point from "ol/geom/point";
import Draw from "ol/interaction/draw";
import Style from "ol/style/style";
import Icon from "ol/style/icon";

class RenderMap extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    //Setting long lat to first location
    this.props.setLongLat(this.props.longitude, this.props.latitude);

    //create the style
    /*var iconStyle = new Style({
      image: new Icon({
        anchor: [0.5, 46],
        anchorXUnits: "fraction",
        anchorYUnits: "pixels",
        opacity: 0.75,
        src: "http://openlayers.org/en/v3.9.0/examples/data/icon.png"
      })
    });*/
    var raster = new Tile({
      source: new OSM()
    });
    var source = new VectorSource({ wrapX: false });
    var vector = new VectorLayer({ source: source /*, style: iconStyle*/ });

    var map = new Map({
      interactions: Interaction.defaults({
        doubleClickZoom: false,
        dragAndDrop: false,
        dragBox: false,
        dragPan: false,
        dragRotate: false,
        dragRotateAndZoom: false,
        dragZoom: false,
        //draw: false,
        //extent: false,
        //interaction: false,
        keyboardPan: false,
        keyboardZoom: false,
        //modify: false,
        mouseWheelZoom: false,
        pinchRotate: false,
        pinchZoom: false
        //pointer: false,
        //select: false
        //snap: false,
        //translate: false
      }),
      view: new View({
        center: [this.props.longitude, this.props.latitude],
        zoom: 17,
        minzoom: 17,
        maxzoom: 20,
        projection: "EPSG:4326"
      }),
      layers: [raster, vector],
      target: this.props.target
    });

    //for Drawing
    var draw = new Draw({
      source: source,
      type: "point"
    });
    map.addInteraction(draw);

    //initial Point
    var currentPoint = new Feature(
      new Point([this.props.longitude, this.props.latitude])
    );
    source.addFeature(currentPoint);

    map.on("click", e => {
      var i = 0;
      //console.log(source.getFeatures()[1].ol_uid);
      for (const x of source.getFeatures()) {
        if (source.getFeatures().length - i === 1) {
          break;
        } else {
          source.removeFeature(
            source.getFeatures()[source.getFeatures.length - i]
          );
          i = i - 1;
        }
        i = i + 1;
      }

      this.props.setLongLat(
        source.getFeatures()[0].values_.geometry.flatCoordinates[0],
        source.getFeatures()[0].values_.geometry.flatCoordinates[1]
      );
      /*//source.removeFeature(source.getFeatures()[0]);
      source.getFeatures().map((item, index) => {
        console.log(index);
        index === 0
          ? console.log("r")
          : source.removeFeature(source.getFeatures()[index]);
      });

      source.clear();*/
    });
  }

  componentDidUpdate() {}

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight / 2 });
  }
  render() {
    return (
      <div
        id={this.props.target}
        style={{
          height: 400,
          width: "100%"
        }}
      />
    );
  }
}

export default RenderMap;
