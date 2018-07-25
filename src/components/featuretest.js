(function() {
  var vectorSource = new ol.source.Vector({
    //create empty vector
  });

  //create a bunch of icons and add to source vector
  for (var i = 0; i < 50; i++) {
    var iconFeature = new ol.Feature({
      geometry: new ol.geom.Point(
        ol.proj.transform(
          [Math.random() * 360 - 180, Math.random() * 180 - 90],
          "EPSG:4326",
          "EPSG:3857"
        )
      ),
      name: "Null Island " + i,
      population: 4000,
      rainfall: 500
    });
    vectorSource.addFeature(iconFeature);
  }

  //create the style
  var iconStyle = new ol.style.Style({
    image: new ol.style.Icon(
      /** @type {olx.style.IconOptions} */ ({
        anchor: [0.5, 46],
        anchorXUnits: "fraction",
        anchorYUnits: "pixels",
        opacity: 0.75,
        src: "http://openlayers.org/en/v3.9.0/examples/data/icon.png"
      })
    )
  });

  //add the feature vector to the layer vector, and apply a style to whole layer
  var vectorLayer = new ol.layer.Vector({
    source: vectorSource,
    style: iconStyle
  });

  var map = new ol.Map({
    layers: [new ol.layer.Tile({ source: new ol.source.OSM() }), vectorLayer],
    target: document.getElementById("map"),
    view: new ol.View({
      center: [0, 0],
      zoom: 3
    })
  });
})();
