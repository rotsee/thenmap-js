var Thenmap = {

  debug: false,
  apiUrl: "//thenmap-api.herokuapp.com/v1/",
  localApiUrl: "http://localhost:3000/v1/", //for debugging
  el: null, //container element
  svg: null, //svg element
  css: null, //css element for dynamically adding styles
  defaultColor: "gainsboro",

  // Default settings that can be overridden by passing arguments to Thenmap
  settings: {
    w: 940,
    h: 600,
    dataKey: null,
    dataset: "se-7",
    date: new Date().toISOString(), //current date, works in any browser that can display SVG
    projection: null,
  },

  /* Entry point
  */
  init: function(elIdentifier, options) {
    var self = this;
    self.ColorLayer.thenmap = self;

    // Apply settings
    self.settings = self.utils.extend(self.settings, options);

    if (typeof elIdentifier === "string") {
      // If first character is #, remove. While technically a valid
      // character in an HTML5 id, it's likely meant as id selector
      elIdentifier = elIdentifier.replace(/^#/, '');
      self.el = document.getElementById(elIdentifier);
    } else if (elIdentifier.nodeType) {
      // User gave us a valid reference to an element
      self.el = elIdentifier;
    } else {
      // not a valid identifier
    }

    // create CSS element for dynamic styling
    var css = document.createElement("style");
    document.getElementsByTagName("head")[0].appendChild(css);
    this.css = css;

    // set default style for svg
    this.ColorLayer.addCssRules([
      {
        selector: "svg.thenmap",
        attribute: "fill",
        value: this.defaultColor
      }
    ]);

    // set default loading style
    var loadingStyle = "@keyframes loading_data {" + 
                       "  0%   {fill-opacity: 0}" +
                       "  100% {fill-opacity: 1}" +
                       "}" +
                       ".loading_data path {" +
                       "  animation: loading_data 1s linear infinite alternate;" +
                       "}   ";

    if (self.css.styleSheet) {
        // IE
        self.css.styleSheet.cssText += loadingStyle;
    } else {
        // Other browsers
        self.css.innerHTML += loadingStyle;
    }

    var httpClient = self.HttpClient;
    httpClient.get(self.createApiUrl(), function(response) {
      var svgString = JSON.parse(response).svg;

      // Something of an hack, to make sure SVG is rendered
      // Creating a SVG element will not make the SVG render
      // in all browsers. innerHTML will.
      var tmp = document.createElement("div");
      tmp.innerHTML = "<svg class='thenmap'>" + svgString + "</svg>";
      self.svg = tmp.getElementsByTagName('svg')[0];
      self.svg.setAttribute("width", self.settings.w);
      self.svg.setAttribute("height", self.settings.h);
      self.el.appendChild(self.svg);

      // Color the map if a spreadsheet key is given
      if (self.settings.dataKey) {
        self.ColorLayer.init(self.settings.dataKey);
      }

    });

  },  // function init

  createApiUrl: function() {
    var apiUrl = this.debug ? this.localApiUrl : this.apiUrl;
    apiUrl += [this.settings.dataset, "svg", this.settings.date].join("/");
    if (this.settings.projection !== null) {
          apiUrl += "?projection=" + this.settings.projection;
    }
    return apiUrl;
  },  // function createApiUrl

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

    /* Fetches data from a Google Spreadsheet using Tabletop
    */
    getSpreadsheetData: function(spreadsheetKey, callback) {
      Tabletop.init({
        key: spreadsheetKey,
        callback: function(data, tabletop) {
          callback(data);
        },
        simpleSheet: true
      })
    }, // getSpreadsheetData

    /* Checks that a string is a valid HEX color
    */
    validColor: function(colorString) {
      return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(colorString);
    },

    /*  Take an array of selectors, attributes and values, and add to style tag
    */
    addCssRules: function(rules) {
      var css = this.thenmap.css;

      var text = "";
      var l = rules.length;
      for (var i = 0; i < l; i++) {
        var d = rules[i];
        text += d.selector + " { " + d.attribute + ": " + d.value+ "; }";
      }

      if (css.styleSheet) {
          // IE
          css.styleSheet.cssText += text;
      } else {
          // Other browsers
          css.innerHTML += text;
      }

    }, // addCssRules

    /* Return the most commons value in object, for the given key
    */
    getMostCommonValue: function(data, key) {
      var dataArray = [];
      for(var d in data) {dataArray.push(data[d][key]);}
      return dataArray.sort(function(a,b){
        return dataArray.filter(function(v){ return v===a }).length
             - dataArray.filter(function(v){ return v===b }).length;
      }).pop();;

    },

    /* Sanitize and validate a color code
    */
    getColorCode: function(string){

      // Make both FF0000 and #FF0000 valid input 
      if (string.substring(0,1) !== "#") {
        string = "#" + string;
      }
      if (this.validColor(string)) {
        return string;
      } else {
        return this.defaultColor;
      }

    },

    /* Colorizes map 
    */
    render: function(data) {
      var self = this;
      var cssRules = [];

      // Use the most common color as default, to reduce number of CSS rules
      var mostCommonColor = this.getMostCommonValue(data, "color");
      mostCommonColor = this.getColorCode(mostCommonColor);

      cssRules.push({
        selector: "svg.thenmap",
        attribute: "fill",
        value: mostCommonColor
      });

      // Create a set of css rules based on data
      for (var i = 0; i < data.length; i++) {
        var d = data[i];
        var colorCode = self.getColorCode(d.color);

        if (colorCode !== mostCommonColor) {
          cssRules.push({
            selector: "." + d.id,
            attribute: "fill",
            value: colorCode
          });
        }
      }

      // Render style tag
      self.addCssRules(cssRules);
    }, // render

    init: function(spreadsheetKey) {
      var self = this;
      var oldClassName = self.thenmap.el.className || "";
      self.thenmap.el.className = [oldClassName, "loading_data"].join(" ");
      self.getSpreadsheetData(spreadsheetKey, function(data) {
        self.thenmap.el.className = oldClassName;
        self.render(data);
      });
    }
  }, // end of ColorLayer

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