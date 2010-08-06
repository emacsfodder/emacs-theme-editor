# Emacs theme editor

So the credit goes to alexpogosyan.com [http://alexpogosyan.com/color-theme-creator/](http://alexpogosyan.com/color-theme-creator/) but I couldn't 
find any contact info (or license) for this so I forked it to add a feature.

# Core features...

The theme-editor lets you start from a light / dark theme (only 2 _defaults_ at this stage.) and then generates a `color-theme.el` for you.

You choose font-lock faces to edit and change colors with a color wheel.

It's quick and easy, albeit not comprehensive. 


# Additions in this fork...

I wanted to be able to reload and edit a theme I'd already made, so added a pastebox textarea and a load theme button to the page. The theme.js contains an additional [routine](http://github.com/jasonm23/emacs-theme-editor/blob/master/assets/themes.js#L152), which is  bound to the load config button.


Also added support for font-lock-constant-face, which was added to the HTML code sample and css.

Most of the time on this was fixing my typos on the regexp set ;)

Anyway, many thanks to Alex P, hope someone sees this and lets him know, because I just wanted to send him the update.

At the moment, it doesn't support color themes from the theme generator at [http://inspiration.sweyla.com/code/](http://inspiration.sweyla.com/code/). However I intend to make the loader a bit more robust (today ?!) - because that would be quite cool. 
