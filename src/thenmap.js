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
    width: 800,
    height: null,
    language: null,
    projection: null,
    dataKey: null,
    dataset: "se-7",
    date: new Date().toISOString(), //current date, works in any browser that can display SVG
    callback: null
  },

  /* Print debug message to the console
  */
  log: function(string) {
    if (this.debug) {
      console.log(string + "\nIn function:"+arguments.callee.caller.name);
    }
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
    self.el.style.width = self.settings.width + "px"
    self.el.style.height = self.settings.height + "px"

    // create CSS element for dynamic styling
    var css = document.createElement("style");
    document.getElementsByTagName("head")[0].appendChild(css);
    this.css = css;

    // set global styles
    @@include('styles.js');
    self.extendCss(CSS["src/styles.css"]);

    var httpClient = self.HttpClient;
    httpClient.get(self.createApiUrl(), function(response) {
      var response_json = JSON.parse(response);
      var svgString = response_json.svg;

      // Something of an hack, to make sure SVG is rendered
      // Creating a SVG element will not make the SVG render
      // in all browsers. innerHTML will.
      var tmp = document.createElement("div");
      tmp.innerHTML = svgString;
      self.svg = tmp.getElementsByTagName('svg')[0];

      //Add filter for hover effect in Chrome
      var defsEl = self.svg.getElementsByTagName('defs')[0];
      var svgNS = "http://www.w3.org/2000/svg";
      var filterEl = document.createElementNS(svgNS, "filter");
      filterEl.id = "sepia";
      filterEl.innerHTML = "<feColorMatrix type='matrix' values='0.35 0.35 0.35 0 0 \
        0.25 0.25 0.25 0 0 \
        0.15 0.15 0.15 0 0 \
        0.50 0.50 0.50 1 0'/>";
      defsEl.appendChild(filterEl);

      self.el.appendChild(self.svg);

      //Apply classes, add titles
      var paths=self.el.getElementsByTagName('path');
      var i = paths.length;
      while(i--) {
        //There will only be one entity for each shape
        var title = document.createElementNS(svgNS,"title");
        title.textContent = paths[i].getAttribute("data-name_1");
        paths[i].appendChild(title);

        //element.className is not available for SVG elements
        paths[i].setAttribute("class", paths[i].getAttribute("data-class_1"));
      }

      // Color the map if a spreadsheet key is given
      if (self.settings.dataKey) {
        self.ColorLayer.init(self.settings.dataKey);
      }

      if (typeof self.settings.callback === "function"){
        self.settings.callback(null, this);
      }

    });

  },  // function init

  createApiUrl: function() {
    var self = this;
    var apiUrl = this.settings.debug ? this.localApiUrl : this.apiUrl;
    apiUrl += [this.settings.dataset, "svg", this.settings.date].join("/");
    // Add url parameters
    var options = ["svg_props=name|class"];
    var paramDict = {width: "svg_width",
                     height: "svg_height",
                     projection: "svg_proj",
                     language: "svg_lang"};
    for (var key in paramDict) {
      var attr = paramDict[key];
      if (self.settings[key] !== null){
        options.push(attr + "=" + self.settings[key]);
      }
    }
    apiUrl += "?" + options.join("&");
    return apiUrl;
  },  // function createApiUrl

  /* Add code to the global stylesheet
  */
  extendCss: function(code) {

    if (this.css.styleSheet) {
        // IE
        this.css.styleSheet.cssText += code;
    } else {
        // Other browsers
        this.css.innerHTML += code;
    }

  },

  HttpClient: {
    get: function(url, callback) {
      var httpRequest = new XMLHttpRequest();
      httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
          callback(httpRequest.responseText);
        }
      }

      httpRequest.open("GET", url, true);
      httpRequest.send(null);
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
        return string.toLowerCase();
      } else {
        // *invalid
        return this.thenmap.defaultColor;
      }

    },

    /* Colorize map
    */
    render: function(data) {
      var self = this;
      var colors = {}

      /* Create a colors object like this:
        { green: [class1, class2], ... }
      */
      var i = data.length;
      while(i--) {
        var d = data[i];
        if (d.color) {
          var colorCode = self.getColorCode(d.color);
          var selector = "path." + d.id;
          if (colorCode in colors){
            colors[colorCode].push(selector);
          } else {
            colors[colorCode] = [selector];
          }
        }
      }

      /* build and apply CSS */
      var cssCode = "";
      for (var color in colors){
        cssCode += colors[color].join(", ") + "{fill:" + color + "}\n";
      }
      self.thenmap.extendCss(cssCode);
    }, // ColorLayer.render

    /* Constructor for thenmap.ColorLayer
    */
    init: function(spreadsheetKey) {
      var self = this;

      // Add loader class while loading
      var oldClassName = self.thenmap.el.className || "";
      self.thenmap.el.className = [oldClassName, "loading_data"].join(" ");
      self.getSpreadsheetData(spreadsheetKey, function(data) {
        // Remove loader class
        self.thenmap.el.className = oldClassName;
        //Use data
        self.render(data);
      });
    } // ColorLayer.init

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
