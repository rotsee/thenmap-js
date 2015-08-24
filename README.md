
## Getting started

Start by preparing your Google Spreadsheet with data. The dataset should contain an `id` column and a `color` column. Make a copy of one of the [sample datasets](https://docs.google.com/spreadsheets/d/1dj8qw3I75qudflfkr4wBDipeehnecsSslemkn2j5qRE/edit#gid=0) to get correct shape ids. The color column should contain a CSS valid color code. The map will be colored based on the value in this column. 

Publish the dataset by clicking __File > Publish to the web__ and __Start publishing__.

Get the id of the Google spreadsheet from the url and add Thenmap to you website with the following code snippet:

```html
    <div id="map"></div>

    <script src="thenmap.js"></script>
    <script>
    var settings = {
      dataKey: "0AmYzu_s7QHsmdDNZUzRlYldnWTZCLXdrMXlYQzVxSFE",
      dataset: "se-7"
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

`dataKey` is the id of the Google spreadsheet. See [the API documentation](http://thenmap-api.herokuapp.com/#datasets) for description of the other settings.

See examples folder for examples.

### Sample data

Swedish municipalities: https://docs.google.com/spreadsheets/d/1dj8qw3I75qudflfkr4wBDipeehnecsSslemkn2j5qRE/edit#gid=0
