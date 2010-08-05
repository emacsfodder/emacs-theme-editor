# Emacs theme editor

So the credit goes to alexpogosyan.com [http://alexpogosyan.com/color-theme-creator/](http://alexpogosyan.com/color-theme-creator/) but I couldn't 
find any contact info (or license) for this so I forked it to add a feature.

# Core features...

The theme-editor lets you start from a light / dark theme (only 2 _defaults_ at this stage.) and then generates a `color-theme.el` for you.

You choose font-lock faces to edit and change colors with a color wheel.

It's quick and easy, albeit not comprehensive. 


# Additions in this fork...

I wanted to be able to reload and edit a theme I'd already made, so added a pastebox textarea and a load theme button to the page. The theme.js contains an additional routine...

    /*
     * load a config (from a textarea etc) it must be in the exact 
     * same form as the theme was generated.
     */
    function loadConfig(conf) {
    
        $('#configname').val(conf.match(/\(defun ([^ ]*) \(\)/)[1]);
    
        var all = {
        	'background':conf.match(/\(\(background-color \. "([^"]*)"/)[1],
        	'border':conf.match(/\(border-color \. "([^"]*)"/)[1],
        	'cursor':conf.match(/\(cursor-color \. "([^"]*)"/)[1],
        	'foreground':conf.match(/\(foreground-color \. "([^"]*)"/)[1], 
        	'modelinefg':conf.match(/\(mode-line \(\(t \(:foreground "([^"]*)" :background "([^"]*)"\)\)\)\)/)[1],
        	'modelinebg':conf.match(/\(mode-line \(\(t \(:foreground "([^"]*)" :background "([^"]*)"\)\)\)\)/)[2],
        	'region':conf.match(/\(region \(\(t \(:background "([^"]*)"\)\)\)\)/)[1], 
        	'builtin':conf.match(/\(font-lock-builtin-face \(\(t \(:foreground "([^"]*)"\)\)\)\)/)[1], 
        	'comment':conf.match(/\(font-lock-comment-face \(\(t \(:foreground "([^"]*)"\)\)\)\)/)[1], 
        	'function':conf.match(/\(font-lock-function-name-face \(\(t \(:foreground "([^"]*)"\)\)\)\)/)[1], 
        	'keyword':conf.match(/\(font-lock-keyword-face \(\(t \(:foreground "([^"]*)"\)\)\)\)/)[1], 
        	'string':conf.match(/\(font-lock-string-face \(\(t \(:foreground "([^"]*)"\)\)\)\)/)[1], 
        	'type':conf.match(/\(font-lock-type-face \(\(t \(:foreground"([^"]*)"\)\)\)\)/)[1],
        	'constant':conf.match(/\(font-lock-constant-face \(\(t \(:foreground "([^"]*)"\)\)\)\)/)[1], 
        	'variable':conf.match(/\(font-lock-variable-name-face \(\(t \(:foreground "([^"]*)"\)\)\)\)/)[1], 
        	'prompt':conf.match(/\(minibuffer-prompt \(\(t \(:foreground "([^"]*)" :bold t\)\)\)\)/)[1]
        };
    
        setTheme(all);
    }

And bound the load config button to it in jquery...

    $('#loadtheme').click(function() {
    	loadConfig($('#pastebox').val());
    })

Also added support for font-lock-constant-face, which was added to the HTML code sample and css.

Most of the time on this was fixing my typos on the regexp set ;)

Anyway, many thanks to Alex P, hope someone sees this and lets him know, because I just wanted to send him the update.

At the moment, it doesn't support color themes from the theme generator at [http://inspiration.sweyla.com/code/](http://inspiration.sweyla.com/code/). However I intend to make the loader a bit more robust (today ?!) - because that would be quite cool. 
