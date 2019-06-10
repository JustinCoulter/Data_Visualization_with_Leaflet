

function createFeatures(earthquakeData) {

    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + "<h3>Magnitude: " + feature.properties.mag + "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }
    // style the markers based on earthquake magnitude
    function myStyle(feature) {
        return {
        radius: feature.properties.mag*5,
        fillColor: getColor(feature.properties.mag),
        color: '#ef3b2c',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
        }
      
    };

    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature,
      style: myStyle,
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng);
      }
    });
    
    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
}
function createMap(earthquakes) {

    // Define streetmap and darkmap layers
    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.streets",
      accessToken: API_KEY
    });
    
    // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Street Map": streetmap,
    };
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      Earthquakes: earthquakes,
    
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map-id", {
      center: [
        37.09, -95.71
      ],
      zoom: 4,
      layers: [streetmap, earthquakes]
    });
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
    mags = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < mags.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(mags[i] + 1) + '"></i> ' +
            mags[i] + (mags[i + 1] ? '&ndash;' + mags[i + 1] + '<br>' : '+');
    }

    return div;
    };
    legend.addTo(myMap);
  
    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
  }

  // function to return color for legend and marker circle
function getColor(d) {
    return d > 9  ? '#800026' :
        d > 8   ? '#bd0026' :
        d > 7   ? '#e31a1c' :
        d > 6   ? '#fc4e2a' :
        d > 5   ? '#fd8d3c' :
        d > 4   ? '#feb24c' :
        d > 3   ? '#fed976' :
        d > 2   ? '#ffeda0' :
        d > 1   ? '#ffffcc' :
                    '#ffffff';
}


var APILink = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";


d3.json(APILink, createFeatures); 
