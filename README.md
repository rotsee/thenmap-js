Simple Javascript library for accessing the [Thenmap](http://www.thenmap.net) API. This script will fetch data for one date at a time. If you want to create sliders, [showing different dates in one visualization](http://old.thenmap.net), we strongly recommend you to rather fetch _all_ borders in one request.

## Getting started

Start by preparing your Google Spreadsheet with data. The spreadsheet should contain a list of the entities that you want to color. The country is entity in the `id` column and the fill color in the `color` column. Thenmap.js accepts any CSS color syntax (e.g. `#99cccc`, `purple` or `rgb(0, 231, 99)`)

We use [ISO 3166](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) codes for modern nations and subdivisions, where available. Use these [sample datasets for reference](https://docs.google.com/spreadsheets/d/1dj8qw3I75qudflfkr4wBDipeehnecsSslemkn2j5qRE/edit#gid=0) to get correct shape ids.

Publish the dataset by clicking __File > Publish to the web__ and __Start publishing__.

Get the id of the Google spreadsheet from the url and add Thenmap.js to you website with the following code snippet:

```html
    <div id="map"></div>

    <script src="thenmap.js"></script>
    <script>
    var settings = {
      dataKey: "0AmYzu_s7QHsmdDNZUzRlYldnWTZCLXdrMXlYQzVxSFE",
      dataset: "world-2",
      date: "1949"
    }
    Thenmap.init("map", settings);
    </script>
```

Thenmap takes the following settings:

<dl>
  <dt>`width`
  <dd>Will determine the size and viewbox of the SVG
  <dt>`height`
  <dd>Will determine the size and viewbox of the SVG
  <dt>`language`
  <dd>Language used for names of geographic areas
  <dt>`dataKey`
  <dd>The id of the Google spreadsheet containing area classes and colors
  <dt>`data`
  <dd>An array of with area classes and colors (dataKey will be ignored). To color all French and Portuguese colonies: `[{color: "#492A85", id: "fr-"}, {color: "#238AC2", id: "pt-"}]`
  <dt>`map`
  <dd>One of the id's listed at [thenmap-api.herokuapp.com/doc/v2](http://thenmap-api.herokuapp.com/doc/v2/#datasets), e.g. `se-7` for Swedish municipalities. The default is `world-2`, nations of the world. Previously known as `dataset`
  <dt>`date`
  `projection`
  <dt>`callback`
  <dd>A function that will be called when the map is fully rendered (but not necessarily colored yet).
</dl>

See [the API documentation](http://thenmap-api.herokuapp.com/doc/v2/) for more details on the settings.

See the examples folder and [the demo page](http://www.thenmap.net/demo) for examples.

## CDN, download and building

The Javascript is hosted on Amazon. To include it from there:

    <script src="https://drvkoaf101245.cloudfront.net/thenmap-1.0.6.min.js"></script>

...or you can simply [download it from there](https://drvkoaf101245.cloudfront.net/thenmap-1.0.6.min.js).

To clone this repo and build the script yourself:

    npm install -g grunt-cli
    git clone https://github.com/rotsee/thenmap-js.git
    cd thenmap-js
    npm install
    grunt

The latest thenmap-x.x.x.min.js file is now in the `build` folder.

## License
This code includes Tabletop.js, copyright (c) 2012-2013 Jonathan Soma, and released under MIT license.

Everything else is copyright 2018 J++ Stockholm, and [released under MIT license](/LICENSE).

In short: Feel free to use the code as you want.

## Changelog

 * 2.2.2

     * Iron out bugs in colour method

 * 2.2.0
      * Add colour method to recolour map

 * 2.1.0

      * Upgrade Tabletop.js to `1.5.4`
      * Add data option to pass coloring data directly
      * Rename <s>`dataset`</s> to `map`, add deprecation notice.

 * 2.0.0

      * Use v2 of the Thenmap API. Some maps may look different, see [this blog post on what's new](http://jplusplus.org/en/blog/version-two-of-the-thenmap-api/).
      * Default dataset is now `world-2` (nations of the world).

 * 1.0.6

      * Remove parts of the debug mode that were ironically buggy.

 * 1.0.5

      * Styling fixes
      * Really make hover effect work in Chrome

 * 1.0.4

      * Use only one API module, making both back- and frontend a bit faster
      * Make hover effect work in Chrome

 * 1.0.3

      * The data module of the API had a _major_ flaw. That is now fixed, but at the cost of breaking backwards compability.

 * 1.0.2

      * Replace depracated API parameter names
      * Resize container element on start
      * Hover effect
      * Minor code fixes

 * 1.0.1

      * Fix bug where a path would miss a title

 * 1.0.0

      * First version
