
## Getting started

Start by preparing your Google Spreadsheet with data. The spreadsheet should contain a list of the countries that you want to color. The country is defined in the `id` column and the fill color in the `color` column. Thenmap.js accepts CSS color synthax.

We follow standard ISO abbreviations for countries. Use these [sample datasets for reference](https://docs.google.com/spreadsheets/d/1dj8qw3I75qudflfkr4wBDipeehnecsSslemkn2j5qRE/edit#gid=0) to get correct shape ids. For older countries that seized to exist before the introduction of ISO we have "invented" own abbreviations.

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

`dataKey` is the id of the Google spreadsheet. `callback` is a function that will be called when the map is fully rendered (but not necessarily colored yet). See [the API documentation](http://thenmap-api.herokuapp.com/#datasets) for description of the other settings.

See examples folder for examples.
