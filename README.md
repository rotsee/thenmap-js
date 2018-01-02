Simple javascript library for accessing the [Thenmap](//www.thenmap.net) API. This script will fetch data for one date at a time. If you want to create sliders, [showing different dates in one visualization](//old.thenmap.net), we strongly recommend you to rather fetch _all_ borders in one request.

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
      dataset: "world",
      date: "1949"
    }
    Thenmap.init("map", settings);
    </script>
```

Thenmap takes the following settings:

- `width`
- `height`  
- `language`  
- `dataKey`  
- `dataset`  
- `date`
- `projection`
- `callback`

`dataKey` is the id of the Google spreadsheet. `callback` is a function that will be called when the map is fully rendered (but not necessarily colored yet). `width` and `height` will determine the size and viewbox of the SVG. See [the API documentation](http://thenmap-api.herokuapp.com/#datasets) for description of the other settings.

See the examples folder and [the demo page](http://www.thenmap.net/demo) for examples.

## CDN

The Javascript is hosted on Amazon. To include it from there:

    <script src="https://drvkoaf101245.cloudfront.net/thenmap-1.0.6.min.js"></script>

##Changelog

 * 1.0.6
 ** Remove parts of the debug mode that were ironically buggy.

 * 1.0.5
 ** Styling fixes
 ** Really make hover effect work in Chrome

 * 1.0.4
 ** Use only one API module, making both back- and frontend a bit faster
 ** Make hover effect work in Chrome

 * 1.0.3
 ** The data module of the API had a _major_ flaw. That is now fixed, but at the cost of breaking backwards compability.

 * 1.0.2
 ** Replace depracated API parameter names
 ** Resize container element on start
 ** Hover effect
 ** Minor code fixes

 * 1.0.1
 ** Fix bug where a path would miss a title

 * 1.0.0
 ** First version
