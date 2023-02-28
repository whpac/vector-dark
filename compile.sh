#!/bin/bash

# First, compile the SCSS files to CSS
SASS_PATH="../dart-sass/sass"
$SASS_PATH scss/dark:css/dark scss/light:css/light --no-source-map

# Then, compactify the CSS files
python3 scripts/compactify.py css