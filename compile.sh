#!/bin/sh
cat \
  js/string.undent.coffee\
  js/theme-generators.coffee\
  js/master-table.coffee\
  js/set-color-tools.coffee\
  js/local-storage-tools.coffee\
  js/undo-tools.coffee\
  js/themes.coffee\
  js/starter-themes.coffee\
  js/emacs-theme-importer.coffee\
  | coffee --bare --compile --stdio > js/themes.js

haml index.haml index.html
