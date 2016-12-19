var CSS = CSS || {};
CSS["src/styles.css"] = 'svg.thenmap {\n  stroke: white;\n  stroke-width: .5px\n}\n@keyframes loading_data {\n  0% {fill-opacity: .25}\n  100% {fill-opacity: .75}\n}\n.loading_data path {\n  animation: loading_data 1s linear infinite alternate;\n}\n\nsvg.thenmap path:hover {\n  filter: url("#sepia"); /*Chrome*/\n  -webkit-filter: sepia(50%);\n  filter: sepia(50%);\n}';
