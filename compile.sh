#!/bin/sh
cat \
  js/theme-generators.coffee\
  js/face-table.coffee\
  js/set-color-tools.coffee\
  js/local-storage-tools.coffee\
  js/undo-tools.coffee\
  js/themes.coffee\
  js/starter-themes.coffee\
  | coffee --bare --compile --stdio > js/themes.js

