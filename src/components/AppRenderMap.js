import React from "react";
import style from "../css/AppRenderMap.css";

// Have to Do this or ol won't work
import ol from "ol";
import Map from "ol/map";
import View from "ol/view";
import Tile from "ol/layer/tile";
import OSM from "ol/source/osm";
import Interaction from "ol/interaction";
import GeoJSON from "ol/format/geojson.js";
import { click, pointerMove, altKeyOnly } from "ol/events/condition.js";
import Select from "ol/interaction/select.js";

// for creating the point
import VectorLayer from "ol/layer/vector";
import VectorSource from "ol/source/vector";
import Feature from "ol/feature";
import Point from "ol/geom/point";
import Circle from "ol/geom/circle";
import MultiPoint from "ol/geom/multipoint";
import Draw from "ol/interaction/draw";

class AppRenderMap extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      localEventsKeys: Object.keys(this.props.localEvents)
    };
  }

  componentDidMount() {
    console.log("triggered");
    console.log(this.props.localEvents);

    var raster = new Tile({
      source: new OSM()
    });

    var source = new VectorSource({});

    var vector = new VectorLayer({
      source: source
    });

    var map = new Map({
      interactions: Interaction.defaults({
        doubleClickZoom: false,
        dragAndDrop: false,
        dragBox: false,
        dragPan: true, // allow drag and move
        dragRotate: false,
        dragRotateAndZoom: false,
        dragZoom: false,
        //draw: false,
        //extent: false,
        //interaction: false,
        keyboardPan: false,
        keyboardZoom: false,
        //modify: false,
        mouseWheelZoom: true,
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
      target: "rwr" //this.props.target
    });

    //This is an array of circles
    var circles = [];

    for (var i = 0; i < this.state.localEventsKeys.length; i++) {
      console.log(
        this.props.localEvents[this.state.localEventsKeys[i]].pos.long
      );
      console.log(
        this.props.localEvents[this.state.localEventsKeys[i]].pos.lat
      );

      circles[i] = new Feature({
        id: this.state.localEventsKeys[i],
        geometry: new Circle(
          [
            this.props.localEvents[this.state.localEventsKeys[i]].pos.long,
            this.props.localEvents[this.state.localEventsKeys[i]].pos.lat
          ],
          0.0004
        )
      });
      circles[i].setId(this.state.localEventsKeys[i]);
      source.addFeature(circles[i]);
    }

    //var currentPoint = new Feature(new Point([-79.828159, 43.7622162]));

    var selectSingleClick = new Select();
    map.addInteraction(selectSingleClick);
    var selectedFeatures = selectSingleClick.getFeatures();
    selectedFeatures.on("add", e => {
      var feature = e.target.item(0);
      //console.log(feature);
      //console.log(feature.id_);
      this.props.setEventId(feature.id_);
      this.props.setEventName(this.props.localEvents[`${feature.id_}`].name);
      this.props.setEventSERP(
        this.props.localEvents[`${feature.id_}`].serpText
      );
      this.props.getStoredImage(this.props.localEvents[`${feature.id_}`].logo);
      //var url = feature.get('url');
    });

    /*selectSingleClick.on("select", e => {
      console.log(e.target.item(0));
    });*/
  }

  componentDidUpdate() {}
  //{this.props.target}
  render() {
    return <div id="rwr" style={style} />;
  }
}

export default AppRenderMap;
