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
    h: 800,
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
      },
      {
        selector: "svg.thenmap",
        attribute: "stroke",
        value: "white"
      },
      {
        selector: "svg.thenmap",
        attribute: "stroke-width",
        value: ".25px"
      }
    ]);

    // set default loading style
    var loadingStyle = "@keyframes loading_data {" + 
                       "  0%   {fill-opacity: .25}" +
                       "  100% {fill-opacity: .75}" +
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
      tmp.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' class='thenmap'>" + svgString + "</svg>";
      self.svg = tmp.getElementsByTagName('svg')[0];
      self.svg.setAttribute("preserveAspectRatio", "xMidYMin meet");
      self.svg.style.height = self.settings.h + "px";
      self.svg.style.width = self.settings.w + "px";

      self.el.appendChild(self.svg); //append SVG before setting viewBox, to get size
      var bbox = self.svg.getBBox();
      self.svg.setAttribute("viewBox", [bbox.x, bbox.y, bbox.width, bbox.height].join(" "));


      // Color the map if a spreadsheet key is given
      if (self.settings.dataKey) {
//        self.ColorLayer.init(self.settings.dataKey);
      }

    });

  },  // function init

  createApiUrl: function() {
    var apiUrl = this.debug ? this.localApiUrl : this.apiUrl;
    apiUrl += [this.settings.dataset, "svg", this.settings.date].join("/");
    var options = [];
    if (this.settings.projection !== null) {
          options.push("projection=" + this.settings.projection);
    }
    if (this.settings.language !== null) {
          options.push("language=" + this.settings.language);
    }
    apiUrl += "?" + options.join("&");
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

    /* Sanitize and validate a SVG color code
       Accepts "#99cccc", "9cc", "green", and "rgb(1,32,42)"
    */
    getColorCode: function(string){

      var string = string.trim();
      var allowedColorNames = ["aliceblue","antiquewhite","aqua","aquamarine","azure","beige","bisque","black","blanchedalmond","blue","blueviolet","brown","burlywood","cadetblue","chartreuse","chocolate","coral","cornflowerblue","cornsilk","crimson","cyan","darkblue","darkcyan","darkgoldenrod","darkgray","darkgreen","darkgrey","darkkhaki","darkmagenta","darkolivegreen","darkorange","darkorchid","darkred","darksalmon","darkseagreen","darkslateblue","darkslategray","darkslategrey","darkturquoise","darkviolet","deeppink","deepskyblue","dimgray","dimgrey","dodgerblue","firebrick","floralwhite","forestgreen","fuchsia","gainsboro","ghostwhite","gold","goldenrod","gray","grey","green","greenyellow","honeydew","hotpink","indianred","indigo","ivory","khaki","lavender","lavenderblush","lawngreen","lemonchiffon","lightblue","lightcoral","lightcyan","lightgoldenrodyellow","lightgray","lightgreen","lightgrey","    ","","lightpink","lightsalmon","lightseagreen","lightskyblue","lightslategray","lightslategrey","lightsteelblue","lightyellow","lime","limegreen","linen","magenta","maroon","mediumaquamarine","mediumblue","mediumorchid","mediumpurple","mediumseagreen","mediumslateblue","mediumspringgreen","mediumturquoise","mediumvioletred","midnightblue","mintcream","mistyrose","moccasin","navajowhite","navy","oldlace","olive","olivedrab","orange","orangered","orchid","palegoldenrod","palegreen","paleturquoise","palevioletred","papayawhip","peachpuff","peru","pink","plum","powderblue","purple","red","rosybrown","royalblue","saddlebrown","salmon","sandybrown","seagreen","seashell","sienna","silver","skyblue","slateblue","slategray","slategrey","snow","springgreen","steelblue","tan","teal","thistle","tomato","turquoise","violet","wheat","white","whitesmoke","yellow","yellowgreen"];
      if (/(^#[0-9A-F]{6}$){1,2}/i.test(string)) {
        // #00cccc
        return string;
      } else if (/(^[0-9A-F]{6}$){1,2}/i.test(string)) {
        // 00cccc
        return "#" + string;
      } else if (allowedColorNames.indexOf(string.toLowerCase()) > -1) { // will work for all SVG capable browsers
        // green
        return string.toLowerCase();
      } else if (/rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i.test(string)){
        // rgb(123,231,432)
        return string;
      } else {
        // *invalid
        return this.thenmap.defaultColor;
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
        selector: "svg.thenmap path",
        attribute: "fill",
        value: mostCommonColor
      });

      // Create a set of css rules based on data
      for (var i = 0; i < data.length; i++) {
        var d = data[i];
        var colorCode = self.getColorCode(d.color);

        if (colorCode !== mostCommonColor) {
          cssRules.push({
            selector: "svg.thenmap ." + d.id,
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