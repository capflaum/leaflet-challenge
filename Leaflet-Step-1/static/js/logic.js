
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(url, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
  console.log(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup('<h4>Place: ' + feature.properties.place + 
    '</h4><h4>Date: ' + new Date(feature.properties.time) + 
    '</h4><h4>Magnitude: ' + feature.properties.mag, {maxWidth: 400})
}

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  var earthquakeLayer = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function(feature, latlng) {
        let radius = feature.properties.mag * 5;

        if (feature.properties.mag > 5) {
            fillcolor = '#f06b6b';
        }
        else if (feature.properties.mag >= 4) {
            fillcolor = '#f0936b';
        }
        else if (feature.properties.mag >= 3) {
            fillcolor = '#f3ba4e';
        }
        else if (feature.properties.mag >= 2) {
            fillcolor = '#f3db4c';
        }
        else if (feature.properties.mag >= 1) {
            fillcolor = '#e1f34c';
        }
        else  fillcolor = '#b7f34d';

        return L.circleMarker(latlng, {
            radius: radius,
            color: 'black',
            fillColor: fillcolor,
            fillOpacity: 1,
            weight: 1
        });
    }
});  

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakeLayer);
}

function getColor(mag) {
  return mag > 5  ? '#f06b6b' :
         mag > 4  ? '#f0936b' :
         mag > 3  ? '#f3ba4e' :
         mag > 2  ? '#f3db4c' :
         mag > 1  ? '#e1f34c' :
                    '#b7f34d';
}

var legend = L.control({ position: "bottomleft" });

legend.onAdd = function(myMap) {
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

  // Define streetmap, darkmap and satellitemap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap,
    "Satellite Map": satellitemap
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map-id", {
    center: [37.09, -95.71],
    zoom: 4,
    layers: [satellitemap, earthquakes]
  });

legend.addTo(myMap);

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}



















/* // store geoJSON
var url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// perform a GET request to the query URL
d3.json(url, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
    console.log(data.features);
});

// Define function to run on each feature 
function createFeatures(earthquakeData) {
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<h3>Magnitude: " + feature.properties.mag +"</h3><h3>Location: "+ feature.properties.place +
              "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
          },

          pointToLayer: function (feature, latlng) {
            return new L.circle(latlng,
              {radius: getRadius(feature.properties.mag),
              fillColor: getColor(feature.properties.mag),
              fillOpacity: .6,
              color: "#000",
              stroke: true,
              weight: .8
          })
        }
        });
};

function getRadius(magnitude) {
    return magnitude * 25000;
};

function getColor(magnitude) {
    if (magnitude > 5) {
        return 'red'
    } else if (magnitude > 4) {
        return 'orange'
    } else if (magnitude > 3) {
        return 'yellow'
    } else if (magnitude > 2) {
        return 'lightgreen'
    } else if (magnitude > 1) {
        return 'green'
    } else {
        return '#58C9CB'
    }
};

function createMap(quakes) {
    var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.satellite",
        accessToken: API_KEY
      });

    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
    });

    var baseMaps = {
        "Satellite Map": satellitemap,
        "Light Map": lightmap
    };

    var overlayMaps = {
        "Earthquakes": quakes
    };

    var myMap = L.map("map-id", {
        center: [40.73, -74.0059],
        zoom: 20,
        layers: [lightmap, quakes]
    });
 
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);
};

function createMarkers(response) {
    var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

    d3.json(url, function(response) {
    
        var heatData= response.features;

        var heatArray = [];
        console.log(heatArray);

        for (var i =0; i<heatData.length; i++) {
            var location = heatData[i].geometry;

            if (location) {
                heatArray.push([location.coordinates[1], location.coordinates[0]]);
                }
                }
            var heat = L.heatLayer(heatArray, {
                radius: 20,
                blur: 35
            }); 
        createMap(L.layerGroup(heat));
    })
};
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", createMarkers);

createMap(); */