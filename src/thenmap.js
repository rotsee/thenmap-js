/*
Usage:

<div id="map"></div>

<script src="thenmap.js"></script>
<script>
var settings = {
  dataKey: "0AmYzu_s7QHsmdDNZUzRlYldnWTZCLXdrMXlYQzVxSFE",
  dataset: "se-7",
  projection: "sweref99"
}
Thenmap.init("map", settings);
</script>

*/

var Thenmap = {

  debug: false,
  apiUrl: "//thenmap-api.herokuapp.com/v1/",
  localApiUrl: "http://localhost:3000/v1/", //for debugging
  el: null,

  settings: {
    w: 940,
    h: 600,
    dataKey: null,
    dataset: "se-7",
    date: 2015,
    projection: "sweref99",
  },

  init: function(elIdentifier, options) {
    var self = this;    

    // Apply settings
    self.settings = self.utils.extend(self.settings, options);

    if (typeof elIdentifier === "string") {
      // If first character is #, remove. While technically a valid
      // character in an HTML5 id, it's likely meant as id selector
      elIdentifier = elIdentifier.replace(/^#/, '');
      self.el = document.getElementById(elIdentifier);
    } else if (elIdentifier.nodeType) {
      self.el = elIdentifier;
    } else {
      self.el = document.createElement("div");
      document.body.appendChild(self.el);
    }

    var httpClient = self.HttpClient;
    var api = self.debug ? self.localApiUrl : self.apiUrl;
    api += self.settings.dataset;
    api += '/svg/';
    api += self.settings.date;
    if (self.settings.projection !== null) {
          api += "?projection=" + self.settings.projection;
    }
    httpClient.get(api, function(response) {
      var svgString = JSON.parse(response).svg;

      // Something of an hack, to make sure SVG is rendered
      // Creating a SVG element will not make the SVG render
      // in all browsers. innerHTML will.
      var tmp = document.createElement("div");
      tmp.innerHTML = "<svg>" + svgString + "</svg>";
      var svg = tmp.getElementsByTagName('svg')[0];
      svg.setAttribute("width", self.settings.w);
      svg.setAttribute("height", self.settings.h);
      self.el.appendChild(svg);

    });

    if (self.settings.dataKey) {
      self.ColorLayer.init(self.settings.dataKey);
    }

  },  // init

  HttpClient: {
    get: function(url, callback) {
      var httpRequest = new XMLHttpRequest();
      httpRequest.onreadystatechange = function() { 
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
          callback(httpRequest.responseText);
        }
      }

      httpRequest.open( "GET", url, true );            
      httpRequest.send( null );
    }
  },  // HttpClient

  ColorLayer: {
    getSpreadsheetData: function(spreadsheetKey, callback) {
      Tabletop.init({
        key: spreadsheetKey,
        callback: function(data, tabletop) {
          callback(data);
        },
        simpleSheet: true
      })
    },
    render: function(data) {
      console.log("Render!");
      console.log(data);
    },
    init: function(spreadsheetKey) {
      var self = this;
      self.getSpreadsheetData(spreadsheetKey, function(data) {
        self.render(data);
      });
    }
  }, // ColorLayer

  utils: {
    extend: function ( defaults, options ) {
      var extended = {};
      var prop;
      for (prop in defaults) {
        if (Object.prototype.hasOwnProperty.call(defaults, prop)) {
          extended[prop] = defaults[prop];
        }
      }
      for (prop in options) {
        if (Object.prototype.hasOwnProperty.call(options, prop)) {
          extended[prop] = options[prop];
        }
      }
      return extended;
    } // Extend js object
  }// Utils

};