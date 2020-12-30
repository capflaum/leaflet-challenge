
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(url, function(data) {
  createFeatures(data.features);
  console.log(data.features);
});

function createFeatures(earthquakeData) {

  function onEachFeature(feature, layer) {
    layer.bindPopup('<h4>Place: ' + feature.properties.place + 
    '</h4><h4>Date: ' + Date(feature.properties.time) + 
    '</h4><h4>Magnitude: ' + feature.properties.mag, {maxWidth: 400})
}

  var earthquakeLayer = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function(feature, latlng) {
        var radius = feature.properties.mag * 3;
        if (feature.properties.mag > 5) {
            //black
            fillcolor = '#000000';
        }
        else if (feature.properties.mag >= 4) {
            // purple
            fillcolor = '#cc00cc';
        }
        else if (feature.properties.mag >= 3) {
            // red
            fillcolor = '#ff0000';
        }
        else if (feature.properties.mag >= 2) {
            // orange
            fillcolor = 'ff9900';
        }
        else if (feature.properties.mag >= 1) {
            // yellow
            fillcolor = '#ffff00';
        }
        else  fillcolor = '#ffffff';

        return L.circleMarker(latlng, {
            radius: radius,
            color: 'black',
            fillColor: fillcolor,
            fillOpacity: 2,
            weight: 1
        });
    }
  });  
  createMap(earthquakeLayer);
}

function getColor(mag) {
  return mag > 5  ? '#000000' :
         mag > 4  ? '#cc00cc' :
         mag > 3  ? '#ff0000' :
         mag > 2  ? '#ff9900' :
         mag > 1  ? '#ffff00' :
                    '#ffffff';
}

var legend = L.control({position: "bottomleft"});

//need to make more visible:
legend.onAdd = function(myMap) {
// L.DomUtil.create to append tag to container
var div = L.DomUtil.create("div", "legend");
magnitude = [0, 1, 2, 3, 4, 5],
labels = [];

for (var i = 0; i < magnitude.length; i++) {
    div.innerHTML +=
        '<i style="background:' + getColor(magnitude[i] + 1) + '"></i> ' +
        magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+');
}
return div;
};

function createMap(earthquakes) {
    var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 20,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });
    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 20,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 20,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Satellite Map": satellitemap,
    "Street Map": streetmap,
    "Dark Map": darkmap
  };
 
  // Create the map object with options
  var myMap = L.map("map", {
    center: [36.71, -120.47],
    zoom: 4,
    layers: [satellitemap, earthquakes]
  });

  legend.addTo(myMap);

// Overlay Object Layer
    var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
};