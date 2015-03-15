#!/bin/sh
cat \
  js/string.undent.coffee\
  js/theme-generators.coffee\
  js/master_table.coffee\
  js/set_color_tools.coffee\
  js/local_storage_tools.coffee\
  js/undo_tools.coffee\
  js/themes.coffee\
  js/starter_themes.coffee\
  js/emacs_theme_importer.coffee\
  | coffee --bare --compile --stdio > js/themes.js

haml index.haml index.html
