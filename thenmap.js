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

  w: 940,
  h: 600,
  apiUrl: "//thenmap-api.herokuapp.com/v1/",
  localApiUrl: "http://localhost:3000/v1/", //for debugging
  dataKey: null,
  dataset: "se-7",
  date: 2015,
  el: null,
  projection: "sweref99",

  init: function(elIdentifier, settings) {
    var self = this;

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
    api += self.dataset;
    api += '/svg/';
    api += self.date;
    if (self.projection !== null) {
          api += "?projection=" + self.projection;
    }
    httpClient.get(api, function(response) {
      var svgString = JSON.parse(response).svg;

      // Something of an hack, to make sure SVG is rendered
      // Creating a SVG element will not make the SVG render
      // in all browsers. innerHTML will.
      var tmp = document.createElement("div");
      tmp.innerHTML = "<svg>" + svgString + "</svg>";
      var svg = tmp.getElementsByTagName('svg')[0];
      svg.setAttribute("width", self.w);
      svg.setAttribute("height", self.h);
      self.el.appendChild(svg);

    });

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
  }  // HttpClient

};