# Emacs Theme Editor

An interactiove theme editor for Emacs 24+

![](http://i.imgur.com/d3KNirF.png)

### Github repo : https://github.com/emacsfodder/emacs-theme-editor

## Overview

Use one of a small collection of starter themes, edit a font face by clicking the color blob next to it's name, change the color, watch it update live, and when you've done your best, click save.

You can keep work in progress by clicking the  +  button under the font faces list, to keep it in your browser's `localStorage`.

The list of starter themes is held in  https://github.com/emacsfodder/emacs-theme-editor/blob/gh-pages/js/starter-themes.coffee if you'd like to add one, you can submit a pull request adding in the same format.

To get the live theme you're editing in JSON format do: `JSON.stringify(App.liveTheme)` in the Browser dev console.

## Quick roadmap (TODO list):

- Theme import (button is currently dead :( )
- Undo facility
- Overall or by selected group, colour edits, brightness, saturation, hue, contrast, etc.
- Allow a description to be used.
- Sanitise a given theme name, remove:
    -  junk chars and trim space
    - spaces to dashes
    - detect and remove "theme" from the name (it's auto appended only to the filename, but should not be in the theme name itself)
- Add proper package header
- Add more faces, I'll be happy to see [issues open on github](https://github.com/emacsfodder/emacs-theme-editor/issues/new) requesting different mode custom faces support.
- Each face should be editable as one line (with foreground/background bold, italic, underline at least)
- More things I haven't thought of yet...

Things I definitely won't do.

- Support complex theme importing.
- Add support for custom theme variables
