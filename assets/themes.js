var picker;

var foregroundRegEx = /foreground-color \. "([^"]*)"/;
var builtinRegEx    = /font-lock-builtin-face \(\(t \(:foreground "([^"]*)"/;
var commentRegEx    = /font-lock-comment-face \(\(t \(:foreground "([^"]*)"/;
var keywordRegEx    = /font-lock-keyword-face \(\(t \(:foreground "([^"]*)"/;
var variableRegEx   = /font-lock-variable-name-face \(\(t \(:foreground "([^"]*)"/;
var constantRegEx   = /font-lock-constant-face \(\(t \(:foreground "([^"]*)"/;
var stringRegEx     = /font-lock-string-face \(\(t \(:foreground "([^"]*)"/;
var typeRegEx       = /font-lock-type-face \(\(t \(:foreground"([^"]*)"/;
var functionRegEx   = /font-lock-function-name-face \(\(t \(:foreground "([^"]*)"/;
var borderRegEx     = /border-color \. "([^"]*)"/;
var backgroundRegEx = /background-color \. "([^"]*)"/;
var modelinebgRegEx = /mode-line \(\(t \(:foreground "[^"]*" :background "([^"]*)"/;
var modelinefgRegEx = /mode-line \(\(t \(:foreground "([^"]*)" :background "[^"]*"/;
var cursorRegEx     = /cursor-color \. "([^"]*)"/;
var promptRegEx     = /minibuffer-prompt \(\(t \(:foreground "([^"]*)"/;
var regionRegEx     = /region \(\(t \(:background "([^"]*)"/;

var all = {
    "foreground"  : [ "#frame"    , "color"                                ], 
    "builtin"     : [ ".builtin"  , "color"                                ], 
    "comment"     : [ ".comment"  , "color"                                ], 
    "keyword"     : [ ".keyword"  , "color"                                ], 
    "variable"    : [ ".variable" , "color"                                ], 
    "constant"    : [ ".constant" , "color"                                ], 
    "string"      : [ ".string"   , "color"                                ], 
    "type"        : [ ".type"     , "color"                                ], 
    "function"    : [ ".function" , "color"                                ], 
    "border"      : [ "#frame"    , "border-color"     , "borderLeftColor" ],
    "background"  : [ "#frame"    , "background-color" , "backgroundColor" ],
    "modelinebg"  : [ "#modeline" , "background-color" , "backgroundColor" ],
    "modelinefg"  : [ "#modeline" , "color"                                ],
    "cursor"      : [ "#cursor"   , "background-color" , "backgroundColor" ],
    "prompt"      : [ "#prompt"   , "color"                                ],
    "region"      : [ ".region"   , "background-color" , "backgroundColor" ]
};

jQuery.fn.center = function () {
    this.css("position","absolute");
    this.css("top",0)
    this.css("left", ( $(window).width() - this.width() ) / 2+$(window).scrollLeft() + "px");
    return this;
}

function mkCb(el) {
    var cb = function(color) {
	$(all[el][0]).css(all[el][1], color);
    };
    return cb;
}

function getcol(el) {
    var prop;
    if (all[el].length > 2)
	prop = all[el][2];
    else
	prop = all[el][1];

    var ccol = ($(all[el][0]).css(prop));
    return rgb2hex(ccol);
}

function setcol(el, col) {
    $(all[el][0]).css(all[el][1], col);
    picker.setColor(rgb2hex(col));
}

function setCurrent(el) {
    var prop;
    if (all[el].length > 2)
	prop = all[el][2];
    else
	prop = all[el][1];

    picker.linkTo(mkCb(el));
    var ccol = ($(all[el][0]).css(prop));
    picker.setColor(rgb2hex(ccol));
}

$(document).ready(function() {
    picker =  $.farbtastic('#colorpicker');

    $("input[name='els']").change(function(){
	setCurrent($(this).val());
    });

    $('#loadtheme').click(function() {
	loadConfig($('#pastebox').val());
    })

    $('#generate').click(function() {
	$('#generate').attr('disabled', 'disabled');
	$('#generate').blur();

	var txt = '<a id="close" href="#" style="float:right">Close [Esc]</a>';
	var confname = $('#configname').val();
	var deftheme = $('#deftheme')[0].checked;

	if(deftheme) {
		var confcode = '<textarea class="confarea">' + getConfigDeftheme() + '</textarea>';
		txt += '<p>Write the following code in <code>.emacs.d/' + confname + '-theme.el</code>';
		txt += confcode;
		txt += '<p>After that, put this in your .emacs</p><pre class="msg">(load-theme \'' + confname  +' t)<br/></pre><p>Restart, you\'re done.</p>';
	} else {
		var confcode = '<textarea class="confarea">' + getConfigColorTheme() + '</textarea>';
		txt += '<p>You\'ll need <a href="http://www.nongnu.org/color-theme/">color-theme</a> installed. Copy this config and put it into a file on your emacs load path or directly in your .emacs. </p>';
		txt += confcode;
		txt += "<p class='msg'>After that, put this into your .emacs:</p><pre class='msg'>(require 'color-theme)<br/>(color-theme-initialize)<br/>(your-config-name)<br/></pre><p class='msg'>and you're done.</p>";
	}

	$('#config').html(txt);
	$('#config').center()
	$('#config').fadeIn("fast");
    });

    $('label').mouseover(function() {
	$(this).css('cursor', 'pointer');
	$(this).css('backgroundColor', '#aaa');
    });

    $('label').mouseout(function() {
	$(this).css('cursor', 'default');
	$(this).css('backgroundColor', '#eee');
    });
    
    $(document).keydown(function(e) {
	if (e.keyCode === 27) {
	    e.preventDefault();
	    closebox();
	}
    });

    $('#close').click(function(e) {
	e.preventDefault();
	closebox();
    });
});

function closebox() {
    $('#config').fadeOut("fast", function(){
	$('.confarea').remove();
	$('.msg').remove();
	$('#config br').remove()
	$('#generate').attr('disabled', '');
    });
}

function rgb2hex(rgb) {
    if (rgb == null)
	return;
    if (rgb[0] == "#")
	return rgb;
    else {
	rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);  

	function hex(x) {  
 	    hexDigits = new Array("0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f");  
 	    return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];  
	}

	return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
    }
}  

// for color-theme package
function getConfigColorTheme() {
    var confname = $('#configname').val();
    var conf = [
	'(defun ' + confname +' ()',
	'  (interactive)',
	'  (color-theme-install',
	'   \'(' + confname,
	'      ((background-color . "' + getcol('background') + '")',
	'      (background-mode . light)',
	'      (border-color . "' + getcol('border') + '")',
	'      (cursor-color . "' + getcol('cursor') + '")',
	'      (foreground-color . "' + getcol('foreground') + '")',
	'      (mouse-color . "black"))',
	'     (fringe ((t (:background "' + getcol('border') + '"))))',
	'     (mode-line ((t (:foreground "' + getcol('modelinefg') + '" :background "' + getcol('modelinebg') + '"))))',
	'     (region ((t (:background "' + getcol('region') + '"))))',
	'     (font-lock-builtin-face ((t (:foreground "' + getcol('builtin') + '"))))',
	'     (font-lock-comment-face ((t (:foreground "' + getcol('comment') + '"))))',
	'     (font-lock-function-name-face ((t (:foreground "' + getcol('function') + '"))))',
	'     (font-lock-keyword-face ((t (:foreground "' + getcol('keyword') + '"))))',
	'     (font-lock-string-face ((t (:foreground "' + getcol('string') + '"))))',
	'     (font-lock-type-face ((t (:foreground"' + getcol('type') + '"))))',
	'     (font-lock-constant-face ((t (:foreground "' + getcol('constant') + '"))))',
	'     (font-lock-variable-name-face ((t (:foreground "' + getcol('variable') + '"))))',
	'     (minibuffer-prompt ((t (:foreground "' + getcol('prompt') + '" :bold t))))',
	'     (font-lock-warning-face ((t (:foreground "red" :bold t))))',
	'     )))',
	'(provide \'' + confname + ')',
    '',
    ];
    return conf.join('\n');
}

// for GNU Emacs 24+
function getConfigDeftheme() {
	var confname = $('#configname').val();
	var conf = [
	'(deftheme ' + confname +' "my custom theme")',
	'(custom-theme-set-faces',
	'  \'' + confname,
	'  \'(default ((t (:foreground "' + getcol('foreground') + '" :background "'+ getcol('background') +'"))))',
	'  \'(cursor ((t (:background "' + getcol('cursor') + '"))))',
	'  \'(fringe ((t (:background "' + getcol('border') + '"))))',
	'  \'(mode-line ((t (:foreground "' + getcol('modelinefg') + '" :background "' + getcol('modelinebg') + '"))))',
	'  \'(region ((t (:background "' + getcol('region') + '"))))',
	'  \'(font-lock-builtin-face ((t (:foreground "' + getcol('builtin') + '"))))',
	'  \'(font-lock-comment-face ((t (:foreground "' + getcol('comment') + '"))))',
	'  \'(font-lock-function-name-face ((t (:foreground "' + getcol('function') + '"))))',
	'  \'(font-lock-keyword-face ((t (:foreground "' + getcol('keyword') + '"))))',
	'  \'(font-lock-string-face ((t (:foreground "' + getcol('string') + '"))))',
	'  \'(font-lock-type-face ((t (:foreground"' + getcol('type') + '"))))',
	'  \'(font-lock-constant-face ((t (:foreground "' + getcol('constant') + '"))))',
	'  \'(font-lock-variable-name-face ((t (:foreground "' + getcol('variable') + '"))))',
	'  \'(minibuffer-prompt ((t (:foreground "' + getcol('prompt') + '" :bold t))))',
	'  \'(font-lock-warning-face ((t (:foreground "red" :bold t))))',
	')',
	'(provide-theme \'' + confname + ')',
	'',
	];
	return conf.join('\n');
}


var themes = [
    {
	'foreground' : '#000000', 
	'builtin'    : '#f820b4', 
	'comment'    : '#7d827d', 
	'keyword'    : '#b415c1', 
	'variable'   : '#e6a00f', 
	'constant'   : '#e6a00f', 
	'string'     : '#c77429', 
	'type'       : '#199915',
	'function'   : '#102cc1', 
	'region'     : '#666666', 
	'border'     : '#969696', 
	'background' : '#f0f0f0', 
	'modelinefg' : '#ffffff', 
	'modelinebg' : '#595959', 
	'cursor'     : '#000000', 
	'prompt'     : '#7299ff'
    },
    {
	'foreground' : '#eeeeec', 
	'builtin'    : '#729fcf', 
	'comment'    : '#888a85', 
	'keyword'    : '#729fcf', 
	'variable'   : '#eeeeec', 
	'constant'   : '#e6a00f', 
	'string'     : '#ad7fa8', 
	'type'       : '#8ae234',
	'function'   : '#edd400', 
	'region'     : '#0d4519', 
	'border'     : '#1a1a1a', 
	'background' : '#101e2e', 
	'modelinefg' : '#eeeeec', 
	'modelinebg' : '#555753', 
	'cursor'     : '#fce94f', 
	'prompt'     : '#729fcf'
    }
]

function setTheme(dict) {
    for (each in dict) {
	setcol(each, dict[each]);
    }
}

function loadConfig(conf) {

    $('#configname').val(conf.match(/defun ([^ ]*)/)[1]);

    var background, border, cursor, foreground, modelinefg, modelinebg, region, builtin, comment, functionName, keyword, string, type, constant, variable, prompt;

    try { background   = conf.match( backgroundRegEx )[1];} catch (err){}
    try { border       = conf.match( borderRegEx     )[1];} catch (err){}
    try { cursor       = conf.match( cursorRegEx     )[1];} catch (err){}
    try { foreground   = conf.match( foregroundRegEx )[1];} catch (err){}
    try { modelinefg   = conf.match( modelinefgRegEx )[1];} catch (err){}
    try { modelinebg   = conf.match( modelinebgRegEx )[1];} catch (err){}
    try { region       = conf.match( regionRegEx     )[1];} catch (err){}
    try { builtin      = conf.match( builtinRegEx    )[1];} catch (err){}
    try { comment      = conf.match( commentRegEx    )[1];} catch (err){}
    try { functionName = conf.match( functionRegEx   )[1];} catch (err){}
    try { keyword      = conf.match( keywordRegEx    )[1];} catch (err){}
    try { string       = conf.match( stringRegEx     )[1];} catch (err){}
    try { type         = conf.match( typeRegEx       )[1];} catch (err){}
    try { constant     = conf.match( constantRegEx   )[1];} catch (err){}
    try { variable     = conf.match( variableRegEx   )[1];} catch (err){}
    try { prompt       = conf.match( promptRegEx     )[1];} catch (err){}

    var all = {
    	'background'  : fromEmacsColor(background  ),
    	'border'      : fromEmacsColor(border      ),
    	'cursor'      : fromEmacsColor(cursor      ),
    	'foreground'  : fromEmacsColor(foreground  ),
    	'modelinefg'  : fromEmacsColor(modelinefg  ),
    	'modelinebg'  : fromEmacsColor(modelinebg, "#323232"),
    	'region'      : fromEmacsColor(region      ),
    	'builtin'     : fromEmacsColor(builtin     ), 
    	'comment'     : fromEmacsColor(comment     ),
    	'function'    : fromEmacsColor(functionName),
    	'keyword'     : fromEmacsColor(keyword     ),
    	'string'      : fromEmacsColor(string      ),
    	'type'        : fromEmacsColor(type        ),
    	'constant'    : fromEmacsColor(constant    ),
    	'variable'    : fromEmacsColor(variable    ),
    	'prompt'      : fromEmacsColor(prompt      )
    };

    setTheme(all);
}

function fromEmacsColor(c, d)
{
    if(c == undefined){
	if (d == undefined)
	{
	    return "#ffffff";
	}
	else
	{
	    return d;
	}
    }	

    for(a in emacsColors)
    {
	if(emacsColors[a].name.toString().toLowerCase() == c.toLowerCase())
	    return emacsColors[a].color;
    }
    return c;
}

var emacsColors = [
    { name: "White"                             , color: "#FEFEFE" }, 
    { name: "Yellow"                            , color: "#FEFE00" }, 
    { name: "Red"                               , color: "#FE0000" }, 
    { name: "Purple"                            , color: "#7F007F" }, 
    { name: "Orange"                            , color: "#FE7F00" }, 
    { name: "Magenta"                           , color: "#FE00FE" }, 
    { name: "Green"                             , color: "#00FE00" }, 
    { name: "Cyan"                              , color: "#00FEFE" }, 
    { name: "Brown"                             , color: "#986532" }, 
    { name: "Blue"                              , color: "#0000FE" }, 
    { name: "Black"                             , color: "#000000" }, 
    { name: "windowFrameTextColor"              , color: "#000000" }, 
    { name: "windowFrameColor"                  , color: "#999999" }, 
    { name: "windowBackgroundColor"             , color: "#000000" }, 
    { name: "textColor"                         , color: "#000000" }, 
    { name: "textBackgroundColor"               , color: "#FDFEFD" }, 
    { name: "shadowColor"                       , color: "#000000" }, 
    { name: "selectedTextColor"                 , color: "#000000" }, 
    { name: "selectedTextBackgroundColor"       , color: "#A7C7FE" }, 
    { name: "selectedMenuItemTextColor"         , color: "#FDFEFD" }, 
    { name: "selectedMenuItemColor"             , color: "#000000" }, 
    { name: "selectedKnobColor"                 , color: "#524F8A" }, 
    { name: "selectedControlTextColor"          , color: "#000000" }, 
    { name: "selectedControlColor"              , color: "#A7C7FE" }, 
    { name: "secondarySelectedControlColor"     , color: "#C9C9C9" }, 
    { name: "scrollBarColor"                    , color: "#999999" }, 
    { name: "knobColor"                         , color: "#8684AF" }, 
    { name: "keyboardFocusIndicatorColor"       , color: "#4A88CF" }, 
    { name: "highlightColor"                    , color: "#FDFEFD" }, 
    { name: "headerTextColor"                   , color: "#000000" }, 
    { name: "headerColor"                       , color: "#999999" }, 
    { name: "gridColor"                         , color: "#BFBFBF" }, 
    { name: "disabledControlTextColor"          , color: "#6B6B6B" }, 
    { name: "controlTextColor"                  , color: "#000000" }, 
    { name: "controlShadowColor"                , color: "#8D8D8D" }, 
    { name: "controlLightHighlightColor"        , color: "#FDFEFD" }, 
    { name: "controlHighlightColor"             , color: "#E2E2E2" }, 
    { name: "controlDarkShadowColor"            , color: "#000000" }, 
    { name: "controlColor"                      , color: "#000000" }, 
    { name: "controlBackgroundColor"            , color: "#FDFEFD" }, 
    { name: "alternateSelectedControlTextColor" , color: "#FEFEFE" }, 
    { name: "alternateSelectedControlColor"     , color: "#2E59D5" }, 
    { name: "Light Gray"                        , color: "#D2D2D2" }, 
    { name: "Gray"                              , color: "#BDBDBD" }, 
    { name: "Dark Gray"                         , color: "#A8A8A8" }, 
    { name: "grey100"                           , color: "#FEFEFE" }, 
    { name: "gray100"                           , color: "#FEFEFE" }, 
    { name: "grey99"                            , color: "#FBFBFB" }, 
    { name: "gray99"                            , color: "#FBFBFB" }, 
    { name: "grey98"                            , color: "#F9F9F9" }, 
    { name: "gray98"                            , color: "#F9F9F9" }, 
    { name: "grey97"                            , color: "#F6F6F6" }, 
    { name: "gray97"                            , color: "#F6F6F6" }, 
    { name: "grey96"                            , color: "#F4F4F4" }, 
    { name: "gray96"                            , color: "#F4F4F4" }, 
    { name: "grey95"                            , color: "#F1F1F1" }, 
    { name: "gray95"                            , color: "#F1F1F1" }, 
    { name: "grey94"                            , color: "#EFEFEF" }, 
    { name: "gray94"                            , color: "#EFEFEF" }, 
    { name: "grey93"                            , color: "#ECECEC" }, 
    { name: "gray93"                            , color: "#ECECEC" }, 
    { name: "grey92"                            , color: "#EAEAEA" }, 
    { name: "gray92"                            , color: "#EAEAEA" }, 
    { name: "grey91"                            , color: "#E7E7E7" }, 
    { name: "gray91"                            , color: "#E7E7E7" }, 
    { name: "grey90"                            , color: "#E4E4E4" }, 
    { name: "gray90"                            , color: "#E4E4E4" }, 
    { name: "grey89"                            , color: "#E2E2E2" }, 
    { name: "gray89"                            , color: "#E2E2E2" }, 
    { name: "grey88"                            , color: "#DFDFDF" }, 
    { name: "gray88"                            , color: "#DFDFDF" }, 
    { name: "grey87"                            , color: "#DDDDDD" }, 
    { name: "gray87"                            , color: "#DDDDDD" }, 
    { name: "grey86"                            , color: "#DADADA" }, 
    { name: "gray86"                            , color: "#DADADA" }, 
    { name: "grey85"                            , color: "#D8D8D8" }, 
    { name: "gray85"                            , color: "#D8D8D8" }, 
    { name: "grey84"                            , color: "#D5D5D5" }, 
    { name: "gray84"                            , color: "#D5D5D5" }, 
    { name: "grey83"                            , color: "#D3D3D3" }, 
    { name: "gray83"                            , color: "#D3D3D3" }, 
    { name: "grey82"                            , color: "#D0D0D0" }, 
    { name: "gray82"                            , color: "#D0D0D0" }, 
    { name: "grey81"                            , color: "#CECECE" }, 
    { name: "gray81"                            , color: "#CECECE" }, 
    { name: "grey80"                            , color: "#CBCBCB" }, 
    { name: "gray80"                            , color: "#CBCBCB" }, 
    { name: "grey79"                            , color: "#C8C8C8" }, 
    { name: "gray79"                            , color: "#C8C8C8" }, 
    { name: "grey78"                            , color: "#C6C6C6" }, 
    { name: "gray78"                            , color: "#C6C6C6" }, 
    { name: "grey77"                            , color: "#C3C3C3" }, 
    { name: "gray77"                            , color: "#C3C3C3" }, 
    { name: "grey76"                            , color: "#C1C1C1" }, 
    { name: "gray76"                            , color: "#C1C1C1" }, 
    { name: "grey75"                            , color: "#BEBEBE" }, 
    { name: "gray75"                            , color: "#BEBEBE" }, 
    { name: "grey74"                            , color: "#BCBCBC" }, 
    { name: "gray74"                            , color: "#BCBCBC" }, 
    { name: "grey73"                            , color: "#B9B9B9" }, 
    { name: "gray73"                            , color: "#B9B9B9" }, 
    { name: "grey72"                            , color: "#B7B7B7" }, 
    { name: "gray72"                            , color: "#B7B7B7" }, 
    { name: "grey71"                            , color: "#B4B4B4" }, 
    { name: "gray71"                            , color: "#B4B4B4" }, 
    { name: "grey70"                            , color: "#B2B2B2" }, 
    { name: "gray70"                            , color: "#B2B2B2" }, 
    { name: "grey69"                            , color: "#AFAFAF" }, 
    { name: "gray69"                            , color: "#AFAFAF" }, 
    { name: "grey68"                            , color: "#ACACAC" }, 
    { name: "gray68"                            , color: "#ACACAC" }, 
    { name: "grey67"                            , color: "#AAAAAA" }, 
    { name: "gray67"                            , color: "#AAAAAA" }, 
    { name: "grey66"                            , color: "#A7A7A7" }, 
    { name: "gray66"                            , color: "#A7A7A7" }, 
    { name: "grey65"                            , color: "#A5A5A5" }, 
    { name: "gray65"                            , color: "#A5A5A5" }, 
    { name: "grey64"                            , color: "#A2A2A2" }, 
    { name: "gray64"                            , color: "#A2A2A2" }, 
    { name: "grey63"                            , color: "#A0A0A0" }, 
    { name: "gray63"                            , color: "#A0A0A0" }, 
    { name: "grey62"                            , color: "#9D9D9D" }, 
    { name: "gray62"                            , color: "#9D9D9D" }, 
    { name: "grey61"                            , color: "#9B9B9B" }, 
    { name: "gray61"                            , color: "#9B9B9B" }, 
    { name: "grey60"                            , color: "#989898" }, 
    { name: "gray60"                            , color: "#989898" }, 
    { name: "grey59"                            , color: "#959595" }, 
    { name: "gray59"                            , color: "#959595" }, 
    { name: "grey58"                            , color: "#939393" }, 
    { name: "gray58"                            , color: "#939393" }, 
    { name: "grey57"                            , color: "#909090" }, 
    { name: "gray57"                            , color: "#909090" }, 
    { name: "grey56"                            , color: "#8E8E8E" }, 
    { name: "gray56"                            , color: "#8E8E8E" }, 
    { name: "grey55"                            , color: "#8B8B8B" }, 
    { name: "gray55"                            , color: "#8B8B8B" }, 
    { name: "grey54"                            , color: "#898989" }, 
    { name: "gray54"                            , color: "#898989" }, 
    { name: "grey53"                            , color: "#868686" }, 
    { name: "gray53"                            , color: "#868686" }, 
    { name: "grey52"                            , color: "#848484" }, 
    { name: "gray52"                            , color: "#848484" }, 
    { name: "grey51"                            , color: "#818181" }, 
    { name: "gray51"                            , color: "#818181" }, 
    { name: "grey50"                            , color: "#7E7E7E" }, 
    { name: "gray50"                            , color: "#7E7E7E" }, 
    { name: "grey49"                            , color: "#7C7C7C" }, 
    { name: "gray49"                            , color: "#7C7C7C" }, 
    { name: "grey48"                            , color: "#797979" }, 
    { name: "gray48"                            , color: "#797979" }, 
    { name: "grey47"                            , color: "#777777" }, 
    { name: "gray47"                            , color: "#777777" }, 
    { name: "grey46"                            , color: "#747474" }, 
    { name: "gray46"                            , color: "#747474" }, 
    { name: "grey45"                            , color: "#727272" }, 
    { name: "gray45"                            , color: "#727272" }, 
    { name: "grey44"                            , color: "#6F6F6F" }, 
    { name: "gray44"                            , color: "#6F6F6F" }, 
    { name: "grey43"                            , color: "#6D6D6D" }, 
    { name: "gray43"                            , color: "#6D6D6D" }, 
    { name: "grey42"                            , color: "#6A6A6A" }, 
    { name: "gray42"                            , color: "#6A6A6A" }, 
    { name: "grey41"                            , color: "#686868" }, 
    { name: "gray41"                            , color: "#686868" }, 
    { name: "grey40"                            , color: "#656565" }, 
    { name: "gray40"                            , color: "#656565" }, 
    { name: "grey39"                            , color: "#626262" }, 
    { name: "gray39"                            , color: "#626262" }, 
    { name: "grey38"                            , color: "#606060" }, 
    { name: "gray38"                            , color: "#606060" }, 
    { name: "grey37"                            , color: "#5D5D5D" }, 
    { name: "gray37"                            , color: "#5D5D5D" }, 
    { name: "grey36"                            , color: "#5B5B5B" }, 
    { name: "gray36"                            , color: "#5B5B5B" }, 
    { name: "grey35"                            , color: "#585858" }, 
    { name: "gray35"                            , color: "#585858" }, 
    { name: "grey34"                            , color: "#565656" }, 
    { name: "gray34"                            , color: "#565656" }, 
    { name: "grey33"                            , color: "#535353" }, 
    { name: "gray33"                            , color: "#535353" }, 
    { name: "grey32"                            , color: "#515151" }, 
    { name: "gray32"                            , color: "#515151" }, 
    { name: "grey31"                            , color: "#4E4E4E" }, 
    { name: "gray31"                            , color: "#4E4E4E" }, 
    { name: "grey30"                            , color: "#4C4C4C" }, 
    { name: "gray30"                            , color: "#4C4C4C" }, 
    { name: "grey29"                            , color: "#494949" }, 
    { name: "gray29"                            , color: "#494949" }, 
    { name: "grey28"                            , color: "#464646" }, 
    { name: "gray28"                            , color: "#464646" }, 
    { name: "grey27"                            , color: "#444444" }, 
    { name: "gray27"                            , color: "#444444" }, 
    { name: "grey26"                            , color: "#414141" }, 
    { name: "gray26"                            , color: "#414141" }, 
    { name: "grey25"                            , color: "#3F3F3F" }, 
    { name: "gray25"                            , color: "#3F3F3F" }, 
    { name: "grey24"                            , color: "#3C3C3C" }, 
    { name: "gray24"                            , color: "#3C3C3C" }, 
    { name: "grey23"                            , color: "#3A3A3A" }, 
    { name: "gray23"                            , color: "#3A3A3A" }, 
    { name: "grey22"                            , color: "#373737" }, 
    { name: "gray22"                            , color: "#373737" }, 
    { name: "grey21"                            , color: "#353535" }, 
    { name: "gray21"                            , color: "#353535" }, 
    { name: "grey20"                            , color: "#323232" }, 
    { name: "gray20"                            , color: "#323232" }, 
    { name: "grey19"                            , color: "#2F2F2F" }, 
    { name: "gray19"                            , color: "#2F2F2F" }, 
    { name: "grey18"                            , color: "#2D2D2D" }, 
    { name: "gray18"                            , color: "#2D2D2D" }, 
    { name: "grey17"                            , color: "#2A2A2A" }, 
    { name: "gray17"                            , color: "#2A2A2A" }, 
    { name: "grey16"                            , color: "#282828" }, 
    { name: "gray16"                            , color: "#282828" }, 
    { name: "grey15"                            , color: "#252525" }, 
    { name: "gray15"                            , color: "#252525" }, 
    { name: "grey14"                            , color: "#232323" }, 
    { name: "gray14"                            , color: "#232323" }, 
    { name: "grey13"                            , color: "#202020" }, 
    { name: "gray13"                            , color: "#202020" }, 
    { name: "grey12"                            , color: "#1E1E1E" }, 
    { name: "gray12"                            , color: "#1E1E1E" }, 
    { name: "grey11"                            , color: "#1B1B1B" }, 
    { name: "gray11"                            , color: "#1B1B1B" }, 
    { name: "grey10"                            , color: "#191919" }, 
    { name: "gray10"                            , color: "#191919" }, 
    { name: "grey9"                             , color: "#161616" }, 
    { name: "gray9"                             , color: "#161616" }, 
    { name: "grey8"                             , color: "#131313" }, 
    { name: "gray8"                             , color: "#131313" }, 
    { name: "grey7"                             , color: "#111111" }, 
    { name: "gray7"                             , color: "#111111" }, 
    { name: "grey6"                             , color: "#0E0E0E" }, 
    { name: "gray6"                             , color: "#0E0E0E" }, 
    { name: "grey5"                             , color: "#0C0C0C" }, 
    { name: "gray5"                             , color: "#0C0C0C" }, 
    { name: "grey4"                             , color: "#090909" }, 
    { name: "gray4"                             , color: "#090909" }, 
    { name: "grey3"                             , color: "#070707" }, 
    { name: "gray3"                             , color: "#070707" }, 
    { name: "grey2"                             , color: "#040404" }, 
    { name: "gray2"                             , color: "#040404" }, 
    { name: "grey1"                             , color: "#020202" }, 
    { name: "gray1"                             , color: "#020202" }, 
    { name: "grey0"                             , color: "#000000" }, 
    { name: "gray0"                             , color: "#000000" }, 
    { name: "thistle4"                          , color: "#8A7A8A" }, 
    { name: "thistle3"                          , color: "#CCB4CC" }, 
    { name: "thistle2"                          , color: "#EDD1ED" }, 
    { name: "thistle1"                          , color: "#FEE0FE" }, 
    { name: "MediumPurple4"                     , color: "#5C468A" }, 
    { name: "MediumPurple3"                     , color: "#8867CC" }, 
    { name: "MediumPurple2"                     , color: "#9E78ED" }, 
    { name: "MediumPurple1"                     , color: "#AA81FE" }, 
    { name: "purple4"                           , color: "#54198A" }, 
    { name: "purple3"                           , color: "#7C25CC" }, 
    { name: "purple2"                           , color: "#902BED" }, 
    { name: "purple1"                           , color: "#9A2FFE" }, 
    { name: "DarkOrchid4"                       , color: "#67218A" }, 
    { name: "DarkOrchid3"                       , color: "#9931CC" }, 
    { name: "DarkOrchid2"                       , color: "#B139ED" }, 
    { name: "DarkOrchid1"                       , color: "#BE3DFE" }, 
    { name: "MediumOrchid4"                     , color: "#79368A" }, 
    { name: "MediumOrchid3"                     , color: "#B351CC" }, 
    { name: "MediumOrchid2"                     , color: "#D05EED" }, 
    { name: "MediumOrchid1"                     , color: "#DF65FE" }, 
    { name: "plum4"                             , color: "#8A658A" }, 
    { name: "plum3"                             , color: "#CC95CC" }, 
    { name: "plum2"                             , color: "#EDADED" }, 
    { name: "plum1"                             , color: "#FEBAFE" }, 
    { name: "orchid4"                           , color: "#8A4688" }, 
    { name: "orchid3"                           , color: "#CC68C8" }, 
    { name: "orchid2"                           , color: "#ED79E8" }, 
    { name: "orchid1"                           , color: "#FE82F9" }, 
    { name: "magenta4"                          , color: "#8A008A" }, 
    { name: "magenta3"                          , color: "#CC00CC" }, 
    { name: "magenta2"                          , color: "#ED00ED" }, 
    { name: "magenta1"                          , color: "#FE00FE" }, 
    { name: "VioletRed4"                        , color: "#8A2151" }, 
    { name: "VioletRed3"                        , color: "#CC3177" }, 
    { name: "VioletRed2"                        , color: "#ED398B" }, 
    { name: "VioletRed1"                        , color: "#FE3D95" }, 
    { name: "maroon4"                           , color: "#8A1B61" }, 
    { name: "maroon3"                           , color: "#CC288F" }, 
    { name: "maroon2"                           , color: "#ED2FA6" }, 
    { name: "maroon1"                           , color: "#FE33B2" }, 
    { name: "PaleVioletRed4"                    , color: "#8A465C" }, 
    { name: "PaleVioletRed3"                    , color: "#CC6788" }, 
    { name: "PaleVioletRed2"                    , color: "#ED789E" }, 
    { name: "PaleVioletRed1"                    , color: "#FE81AA" }, 
    { name: "LightPink4"                        , color: "#8A5E64" }, 
    { name: "LightPink3"                        , color: "#CC8B94" }, 
    { name: "LightPink2"                        , color: "#EDA1AC" }, 
    { name: "LightPink1"                        , color: "#FEADB8" }, 
    { name: "pink4"                             , color: "#8A626B" }, 
    { name: "pink3"                             , color: "#CC909D" }, 
    { name: "pink2"                             , color: "#EDA8B7" }, 
    { name: "pink1"                             , color: "#FEB4C4" }, 
    { name: "HotPink4"                          , color: "#8A3961" }, 
    { name: "HotPink3"                          , color: "#CC5F8F" }, 
    { name: "HotPink2"                          , color: "#ED69A6" }, 
    { name: "HotPink1"                          , color: "#FE6DB3" }, 
    { name: "DeepPink4"                         , color: "#8A094F" }, 
    { name: "DeepPink3"                         , color: "#CC0F75" }, 
    { name: "DeepPink2"                         , color: "#ED1188" }, 
    { name: "DeepPink1"                         , color: "#FE1392" }, 
    { name: "red4"                              , color: "#8A0000" }, 
    { name: "red3"                              , color: "#CC0000" }, 
    { name: "red2"                              , color: "#ED0000" }, 
    { name: "red1"                              , color: "#FE0000" }, 
    { name: "OrangeRed4"                        , color: "#8A2400" }, 
    { name: "OrangeRed3"                        , color: "#CC3600" }, 
    { name: "OrangeRed2"                        , color: "#ED3F00" }, 
    { name: "OrangeRed1"                        , color: "#FE4400" }, 
    { name: "tomato4"                           , color: "#8A3525" }, 
    { name: "tomato3"                           , color: "#CC4E38" }, 
    { name: "tomato2"                           , color: "#ED5B41" }, 
    { name: "tomato1"                           , color: "#FE6246" }, 
    { name: "coral4"                            , color: "#8A3D2E" }, 
    { name: "coral3"                            , color: "#CC5A44" }, 
    { name: "coral2"                            , color: "#ED694F" }, 
    { name: "coral1"                            , color: "#FE7155" }, 
    { name: "DarkOrange4"                       , color: "#8A4400" }, 
    { name: "DarkOrange3"                       , color: "#CC6500" }, 
    { name: "DarkOrange2"                       , color: "#ED7500" }, 
    { name: "DarkOrange1"                       , color: "#FE7E00" }, 
    { name: "orange4"                           , color: "#8A5900" }, 
    { name: "orange3"                           , color: "#CC8400" }, 
    { name: "orange2"                           , color: "#ED9900" }, 
    { name: "orange1"                           , color: "#FEA400" }, 
    { name: "LightSalmon4"                      , color: "#8A5641" }, 
    { name: "LightSalmon3"                      , color: "#CC8061" }, 
    { name: "LightSalmon2"                      , color: "#ED9471" }, 
    { name: "LightSalmon1"                      , color: "#FE9F79" }, 
    { name: "salmon4"                           , color: "#8A4B38" }, 
    { name: "salmon3"                           , color: "#CC6F53" }, 
    { name: "salmon2"                           , color: "#ED8161" }, 
    { name: "salmon1"                           , color: "#FE8B68" }, 
    { name: "brown4"                            , color: "#8A2222" }, 
    { name: "brown3"                            , color: "#CC3232" }, 
    { name: "brown2"                            , color: "#ED3A3A" }, 
    { name: "brown1"                            , color: "#FE3F3F" }, 
    { name: "firebrick4"                        , color: "#8A1919" }, 
    { name: "firebrick3"                        , color: "#CC2525" }, 
    { name: "firebrick2"                        , color: "#ED2B2B" }, 
    { name: "firebrick1"                        , color: "#FE2F2F" }, 
    { name: "chocolate4"                        , color: "#8A4412" }, 
    { name: "chocolate3"                        , color: "#CC651C" }, 
    { name: "chocolate2"                        , color: "#ED7520" }, 
    { name: "chocolate1"                        , color: "#FE7E23" }, 
    { name: "tan4"                              , color: "#8A592A" }, 
    { name: "tan3"                              , color: "#CC843E" }, 
    { name: "tan2"                              , color: "#ED9948" }, 
    { name: "tan1"                              , color: "#FEA44E" }, 
    { name: "wheat4"                            , color: "#8A7D65" }, 
    { name: "wheat3"                            , color: "#CCB995" }, 
    { name: "wheat2"                            , color: "#EDD7AD" }, 
    { name: "wheat1"                            , color: "#FEE6B9" }, 
    { name: "burlywood4"                        , color: "#8A7254" }, 
    { name: "burlywood3"                        , color: "#CCA97C" }, 
    { name: "burlywood2"                        , color: "#EDC490" }, 
    { name: "burlywood1"                        , color: "#FED29A" }, 
    { name: "sienna4"                           , color: "#8A4625" }, 
    { name: "sienna3"                           , color: "#CC6738" }, 
    { name: "sienna2"                           , color: "#ED7841" }, 
    { name: "sienna1"                           , color: "#FE8146" }, 
    { name: "IndianRed4"                        , color: "#8A3939" }, 
    { name: "IndianRed3"                        , color: "#CC5454" }, 
    { name: "IndianRed2"                        , color: "#ED6262" }, 
    { name: "IndianRed1"                        , color: "#FE6969" }, 
    { name: "RosyBrown4"                        , color: "#8A6868" }, 
    { name: "RosyBrown3"                        , color: "#CC9A9A" }, 
    { name: "RosyBrown2"                        , color: "#EDB3B3" }, 
    { name: "RosyBrown1"                        , color: "#FEC0C0" }, 
    { name: "DarkGoldenrod4"                    , color: "#8A6407" }, 
    { name: "DarkGoldenrod3"                    , color: "#CC940B" }, 
    { name: "DarkGoldenrod2"                    , color: "#EDAC0D" }, 
    { name: "DarkGoldenrod1"                    , color: "#FEB80E" }, 
    { name: "goldenrod4"                        , color: "#8A6813" }, 
    { name: "goldenrod3"                        , color: "#CC9A1C" }, 
    { name: "goldenrod2"                        , color: "#EDB321" }, 
    { name: "goldenrod1"                        , color: "#FEC024" }, 
    { name: "gold4"                             , color: "#8A7400" }, 
    { name: "gold3"                             , color: "#CCAC00" }, 
    { name: "gold2"                             , color: "#EDC800" }, 
    { name: "gold1"                             , color: "#FED600" }, 
    { name: "yellow4"                           , color: "#8A8A00" }, 
    { name: "yellow3"                           , color: "#CCCC00" }, 
    { name: "yellow2"                           , color: "#EDED00" }, 
    { name: "yellow1"                           , color: "#FEFE00" }, 
    { name: "LightYellow4"                      , color: "#8A8A79" }, 
    { name: "LightYellow3"                      , color: "#CCCCB3" }, 
    { name: "LightYellow2"                      , color: "#EDEDD0" }, 
    { name: "LightYellow1"                      , color: "#FEFEDF" }, 
    { name: "LightGoldenrod4"                   , color: "#8A804B" }, 
    { name: "LightGoldenrod3"                   , color: "#CCBD6F" }, 
    { name: "LightGoldenrod2"                   , color: "#EDDB81" }, 
    { name: "LightGoldenrod1"                   , color: "#FEEB8A" }, 
    { name: "khaki4"                            , color: "#8A854D" }, 
    { name: "khaki3"                            , color: "#CCC572" }, 
    { name: "khaki2"                            , color: "#EDE584" }, 
    { name: "khaki1"                            , color: "#FEF58E" }, 
    { name: "DarkOliveGreen4"                   , color: "#6D8A3C" }, 
    { name: "DarkOliveGreen3"                   , color: "#A1CC59" }, 
    { name: "DarkOliveGreen2"                   , color: "#BBED67" }, 
    { name: "DarkOliveGreen1"                   , color: "#C9FE6F" }, 
    { name: "OliveDrab4"                        , color: "#688A21" }, 
    { name: "OliveDrab3"                        , color: "#99CC31" }, 
    { name: "OliveDrab2"                        , color: "#B2ED39" }, 
    { name: "OliveDrab1"                        , color: "#BFFE3D" }, 
    { name: "chartreuse4"                       , color: "#448A00" }, 
    { name: "chartreuse3"                       , color: "#65CC00" }, 
    { name: "chartreuse2"                       , color: "#75ED00" }, 
    { name: "chartreuse1"                       , color: "#7EFE00" }, 
    { name: "green4"                            , color: "#008A00" }, 
    { name: "green3"                            , color: "#00CC00" }, 
    { name: "green2"                            , color: "#00ED00" }, 
    { name: "green1"                            , color: "#00FE00" }, 
    { name: "SpringGreen4"                      , color: "#008A44" }, 
    { name: "SpringGreen3"                      , color: "#00CC65" }, 
    { name: "SpringGreen2"                      , color: "#00ED75" }, 
    { name: "SpringGreen1"                      , color: "#00FE7E" }, 
    { name: "PaleGreen4"                        , color: "#538A53" }, 
    { name: "PaleGreen3"                        , color: "#7BCC7B" }, 
    { name: "PaleGreen2"                        , color: "#8FED8F" }, 
    { name: "PaleGreen1"                        , color: "#99FE99" }, 
    { name: "SeaGreen4"                         , color: "#2D8A56" }, 
    { name: "SeaGreen3"                         , color: "#42CC7F" }, 
    { name: "SeaGreen2"                         , color: "#4DED93" }, 
    { name: "SeaGreen1"                         , color: "#53FE9E" }, 
    { name: "DarkSeaGreen4"                     , color: "#688A68" }, 
    { name: "DarkSeaGreen3"                     , color: "#9ACC9A" }, 
    { name: "DarkSeaGreen2"                     , color: "#B3EDB3" }, 
    { name: "DarkSeaGreen1"                     , color: "#C0FEC0" }, 
    { name: "aquamarine4"                       , color: "#448A73" }, 
    { name: "aquamarine3"                       , color: "#65CCA9" }, 
    { name: "aquamarine2"                       , color: "#75EDC5" }, 
    { name: "aquamarine1"                       , color: "#7EFED3" }, 
    { name: "DarkSlateGray4"                    , color: "#518A8A" }, 
    { name: "DarkSlateGray3"                    , color: "#78CCCC" }, 
    { name: "DarkSlateGray2"                    , color: "#8CEDED" }, 
    { name: "DarkSlateGray1"                    , color: "#96FEFE" }, 
    { name: "cyan4"                             , color: "#008A8A" }, 
    { name: "cyan3"                             , color: "#00CCCC" }, 
    { name: "cyan2"                             , color: "#00EDED" }, 
    { name: "cyan1"                             , color: "#00FEFE" }, 
    { name: "turquoise4"                        , color: "#00858A" }, 
    { name: "turquoise3"                        , color: "#00C4CC" }, 
    { name: "turquoise2"                        , color: "#00E4ED" }, 
    { name: "turquoise1"                        , color: "#00F4FE" }, 
    { name: "CadetBlue4"                        , color: "#52858A" }, 
    { name: "CadetBlue3"                        , color: "#79C4CC" }, 
    { name: "CadetBlue2"                        , color: "#8DE4ED" }, 
    { name: "CadetBlue1"                        , color: "#97F4FE" }, 
    { name: "PaleTurquoise4"                    , color: "#658A8A" }, 
    { name: "PaleTurquoise3"                    , color: "#95CCCC" }, 
    { name: "PaleTurquoise2"                    , color: "#ADEDED" }, 
    { name: "PaleTurquoise1"                    , color: "#BAFEFE" }, 
    { name: "LightCyan4"                        , color: "#798A8A" }, 
    { name: "LightCyan3"                        , color: "#B3CCCC" }, 
    { name: "LightCyan2"                        , color: "#D0EDED" }, 
    { name: "LightCyan1"                        , color: "#DFFEFE" }, 
    { name: "LightBlue4"                        , color: "#67828A" }, 
    { name: "LightBlue3"                        , color: "#99BFCC" }, 
    { name: "LightBlue2"                        , color: "#B1DEED" }, 
    { name: "LightBlue1"                        , color: "#BEEEFE" }, 
    { name: "LightSteelBlue4"                   , color: "#6D7A8A" }, 
    { name: "LightSteelBlue3"                   , color: "#A1B4CC" }, 
    { name: "LightSteelBlue2"                   , color: "#BBD1ED" }, 
    { name: "LightSteelBlue1"                   , color: "#C9E0FE" }, 
    { name: "SlateGray4"                        , color: "#6B7A8A" }, 
    { name: "SlateGray3"                        , color: "#9EB5CC" }, 
    { name: "SlateGray2"                        , color: "#B8D2ED" }, 
    { name: "SlateGray1"                        , color: "#C5E1FE" }, 
    { name: "LightSkyBlue4"                     , color: "#5F7A8A" }, 
    { name: "LightSkyBlue3"                     , color: "#8CB5CC" }, 
    { name: "LightSkyBlue2"                     , color: "#A3D2ED" }, 
    { name: "LightSkyBlue1"                     , color: "#AFE1FE" }, 
    { name: "SkyBlue4"                          , color: "#496F8A" }, 
    { name: "SkyBlue3"                          , color: "#6BA5CC" }, 
    { name: "SkyBlue2"                          , color: "#7DBFED" }, 
    { name: "SkyBlue1"                          , color: "#86CDFE" }, 
    { name: "DeepSkyBlue4"                      , color: "#00678A" }, 
    { name: "DeepSkyBlue3"                      , color: "#0099CC" }, 
    { name: "DeepSkyBlue2"                      , color: "#00B1ED" }, 
    { name: "DeepSkyBlue1"                      , color: "#00BEFE" }, 
    { name: "SteelBlue4"                        , color: "#35638A" }, 
    { name: "SteelBlue3"                        , color: "#4E93CC" }, 
    { name: "SteelBlue2"                        , color: "#5BABED" }, 
    { name: "SteelBlue1"                        , color: "#62B7FE" }, 
    { name: "DodgerBlue4"                       , color: "#0F4D8A" }, 
    { name: "DodgerBlue3"                       , color: "#1773CC" }, 
    { name: "DodgerBlue2"                       , color: "#1B85ED" }, 
    { name: "DodgerBlue1"                       , color: "#1D8FFE" }, 
    { name: "blue4"                             , color: "#00008A" }, 
    { name: "blue3"                             , color: "#0000CC" }, 
    { name: "blue2"                             , color: "#0000ED" }, 
    { name: "blue1"                             , color: "#0000FE" }, 
    { name: "RoyalBlue4"                        , color: "#263F8A" }, 
    { name: "RoyalBlue3"                        , color: "#395ECC" }, 
    { name: "RoyalBlue2"                        , color: "#426DED" }, 
    { name: "RoyalBlue1"                        , color: "#4775FE" }, 
    { name: "SlateBlue4"                        , color: "#463B8A" }, 
    { name: "SlateBlue3"                        , color: "#6858CC" }, 
    { name: "SlateBlue2"                        , color: "#7966ED" }, 
    { name: "SlateBlue1"                        , color: "#826EFE" }, 
    { name: "azure4"                            , color: "#828A8A" }, 
    { name: "azure3"                            , color: "#C0CCCC" }, 
    { name: "azure2"                            , color: "#DFEDED" }, 
    { name: "azure1"                            , color: "#EFFEFE" }, 
    { name: "MistyRose4"                        , color: "#8A7C7A" }, 
    { name: "MistyRose3"                        , color: "#CCB6B4" }, 
    { name: "MistyRose2"                        , color: "#EDD4D1" }, 
    { name: "MistyRose1"                        , color: "#FEE3E0" }, 
    { name: "LavenderBlush4"                    , color: "#8A8285" }, 
    { name: "LavenderBlush3"                    , color: "#CCC0C4" }, 
    { name: "LavenderBlush2"                    , color: "#EDDFE4" }, 
    { name: "LavenderBlush1"                    , color: "#FEEFF4" }, 
    { name: "honeydew4"                         , color: "#828A82" }, 
    { name: "honeydew3"                         , color: "#C0CCC0" }, 
    { name: "honeydew2"                         , color: "#DFEDDF" }, 
    { name: "honeydew1"                         , color: "#EFFEEF" }, 
    { name: "ivory4"                            , color: "#8A8A82" }, 
    { name: "ivory3"                            , color: "#CCCCC0" }, 
    { name: "ivory2"                            , color: "#EDEDDF" }, 
    { name: "ivory1"                            , color: "#FEFEEF" }, 
    { name: "cornsilk4"                         , color: "#8A8777" }, 
    { name: "cornsilk3"                         , color: "#CCC7B0" }, 
    { name: "cornsilk2"                         , color: "#EDE7CC" }, 
    { name: "cornsilk1"                         , color: "#FEF7DB" }, 
    { name: "LemonChiffon4"                     , color: "#8A886F" }, 
    { name: "LemonChiffon3"                     , color: "#CCC8A4" }, 
    { name: "LemonChiffon2"                     , color: "#EDE8BE" }, 
    { name: "LemonChiffon1"                     , color: "#FEF9CC" }, 
    { name: "NavajoWhite4"                      , color: "#8A785D" }, 
    { name: "NavajoWhite3"                      , color: "#CCB28A" }, 
    { name: "NavajoWhite2"                      , color: "#EDCEA0" }, 
    { name: "NavajoWhite1"                      , color: "#FEDDAC" }, 
    { name: "PeachPuff4"                        , color: "#8A7664" }, 
    { name: "PeachPuff3"                        , color: "#CCAE94" }, 
    { name: "PeachPuff2"                        , color: "#EDCAAC" }, 
    { name: "PeachPuff1"                        , color: "#FED9B8" }, 
    { name: "bisque4"                           , color: "#8A7C6A" }, 
    { name: "bisque3"                           , color: "#CCB69D" }, 
    { name: "bisque2"                           , color: "#EDD4B6" }, 
    { name: "bisque1"                           , color: "#FEE3C3" }, 
    { name: "AntiqueWhite4"                     , color: "#8A8277" }, 
    { name: "AntiqueWhite3"                     , color: "#CCBFAF" }, 
    { name: "AntiqueWhite2"                     , color: "#EDDECB" }, 
    { name: "AntiqueWhite1"                     , color: "#FEEEDA" }, 
    { name: "seashell4"                         , color: "#8A8581" }, 
    { name: "seashell3"                         , color: "#CCC4BE" }, 
    { name: "seashell2"                         , color: "#EDE4DD" }, 
    { name: "seashell1"                         , color: "#FEF4ED" }, 
    { name: "snow4"                             , color: "#8A8888" }, 
    { name: "snow3"                             , color: "#CCC8C8" }, 
    { name: "snow2"                             , color: "#EDE8E8" }, 
    { name: "snow1"                             , color: "#FEF9F9" }, 
    { name: "thistle"                           , color: "#D7BED7" }, 
    { name: "MediumPurple"                      , color: "#926FDA" }, 
    { name: "medium purple"                     , color: "#926FDA" }, 
    { name: "purple"                            , color: "#7F007F" }, 
    { name: "BlueViolet"                        , color: "#892AE1" }, 
    { name: "blue violet"                       , color: "#892AE1" }, 
    { name: "DarkViolet"                        , color: "#9300D2" }, 
    { name: "dark violet"                       , color: "#9300D2" }, 
    { name: "DarkOrchid"                        , color: "#9831CB" }, 
    { name: "dark orchid"                       , color: "#9831CB" }, 
    { name: "MediumOrchid"                      , color: "#B954D2" }, 
    { name: "medium orchid"                     , color: "#B954D2" }, 
    { name: "orchid"                            , color: "#D96FD5" }, 
    { name: "plum"                              , color: "#DC9FDC" }, 
    { name: "violet"                            , color: "#ED81ED" }, 
    { name: "magenta"                           , color: "#FE00FE" }, 
    { name: "VioletRed"                         , color: "#CF1F8F" }, 
    { name: "violet red"                        , color: "#CF1F8F" }, 
    { name: "MediumVioletRed"                   , color: "#C61484" }, 
    { name: "medium violet red"                 , color: "#C61484" }, 
    { name: "maroon"                            , color: "#AF2F5F" }, 
    { name: "PaleVioletRed"                     , color: "#DA6F92" }, 
    { name: "pale violet red"                   , color: "#DA6F92" }, 
    { name: "LightPink"                         , color: "#FEB5C0" }, 
    { name: "light pink"                        , color: "#FEB5C0" }, 
    { name: "pink"                              , color: "#FEBFCA" }, 
    { name: "DeepPink"                          , color: "#FE1392" }, 
    { name: "deep pink"                         , color: "#FE1392" }, 
    { name: "HotPink"                           , color: "#FE68B3" }, 
    { name: "hot pink"                          , color: "#FE68B3" }, 
    { name: "red"                               , color: "#FE0000" }, 
    { name: "OrangeRed"                         , color: "#FE4400" }, 
    { name: "orange red"                        , color: "#FE4400" }, 
    { name: "tomato"                            , color: "#FE6246" }, 
    { name: "LightCoral"                        , color: "#EF7F7F" }, 
    { name: "light coral"                       , color: "#EF7F7F" }, 
    { name: "coral"                             , color: "#FE7E4F" }, 
    { name: "DarkOrange"                        , color: "#FE8B00" }, 
    { name: "dark orange"                       , color: "#FE8B00" }, 
    { name: "orange"                            , color: "#FE7F00" }, 
    { name: "LightSalmon"                       , color: "#FE9F79" }, 
    { name: "light salmon"                      , color: "#FE9F79" }, 
    { name: "salmon"                            , color: "#F97F71" }, 
    { name: "DarkSalmon"                        , color: "#E89579" }, 
    { name: "dark salmon"                       , color: "#E89579" }, 
    { name: "brown"                             , color: "#986532" }, 
    { name: "firebrick"                         , color: "#B12121" }, 
    { name: "chocolate"                         , color: "#D1681D" }, 
    { name: "tan"                               , color: "#D1B38B" }, 
    { name: "SandyBrown"                        , color: "#F3A35F" }, 
    { name: "sandy brown"                       , color: "#F3A35F" }, 
    { name: "wheat"                             , color: "#F4DDB2" }, 
    { name: "beige"                             , color: "#F4F4DB" }, 
    { name: "burlywood"                         , color: "#DDB786" }, 
    { name: "peru"                              , color: "#CC843E" }, 
    { name: "sienna"                            , color: "#9F512C" }, 
    { name: "SaddleBrown"                       , color: "#8A4412" }, 
    { name: "saddle brown"                      , color: "#8A4412" }, 
    { name: "IndianRed"                         , color: "#CC5B5B" }, 
    { name: "indian red"                        , color: "#CC5B5B" }, 
    { name: "RosyBrown"                         , color: "#BB8E8E" }, 
    { name: "rosy brown"                        , color: "#BB8E8E" }, 
    { name: "DarkGoldenrod"                     , color: "#B7850A" }, 
    { name: "dark goldenrod"                    , color: "#B7850A" }, 
    { name: "Goldenrod"                         , color: "#D9A41F" }, 
    { name: "goldenrod"                         , color: "#D9A41F" }, 
    { name: "LightGoldenrod"                    , color: "#EDDC81" }, 
    { name: "light goldenrod"                   , color: "#EDDC81" }, 
    { name: "gold"                              , color: "#FED600" }, 
    { name: "yellow"                            , color: "#FEFE00" }, 
    { name: "LightYellow"                       , color: "#FEFEDF" }, 
    { name: "light yellow"                      , color: "#FEFEDF" }, 
    { name: "LightGoldenrodYellow"              , color: "#F9F9D1" }, 
    { name: "light goldenrod yellow"            , color: "#F9F9D1" }, 
    { name: "PaleGoldenrod"                     , color: "#EDE7A9" }, 
    { name: "pale goldenrod"                    , color: "#EDE7A9" }, 
    { name: "khaki"                             , color: "#EFE58B" }, 
    { name: "DarkKhaki"                         , color: "#BCB66A" }, 
    { name: "dark khaki"                        , color: "#BCB66A" }, 
    { name: "OliveDrab"                         , color: "#6A8D22" }, 
    { name: "olive drab"                        , color: "#6A8D22" }, 
    { name: "ForestGreen"                       , color: "#218A21" }, 
    { name: "forest green"                      , color: "#218A21" }, 
    { name: "YellowGreen"                       , color: "#99CC31" }, 
    { name: "yellow green"                      , color: "#99CC31" }, 
    { name: "LimeGreen"                         , color: "#31CC31" }, 
    { name: "lime green"                        , color: "#31CC31" }, 
    { name: "GreenYellow"                       , color: "#ACFE2E" }, 
    { name: "green yellow"                      , color: "#ACFE2E" }, 
    { name: "MediumSpringGreen"                 , color: "#00F999" }, 
    { name: "medium spring green"               , color: "#00F999" }, 
    { name: "chartreuse"                        , color: "#7EFE00" }, 
    { name: "green"                             , color: "#00FE00" }, 
    { name: "LawnGreen"                         , color: "#7BFB00" }, 
    { name: "lawn green"                        , color: "#7BFB00" }, 
    { name: "SpringGreen"                       , color: "#00FE7E" }, 
    { name: "spring green"                      , color: "#00FE7E" }, 
    { name: "PaleGreen"                         , color: "#97FA97" }, 
    { name: "pale green"                        , color: "#97FA97" }, 
    { name: "LightSeaGreen"                     , color: "#1FB1A9" }, 
    { name: "light sea green"                   , color: "#1FB1A9" }, 
    { name: "MediumSeaGreen"                    , color: "#3BB270" }, 
    { name: "medium sea green"                  , color: "#3BB270" }, 
    { name: "SeaGreen"                          , color: "#2D8A56" }, 
    { name: "sea green"                         , color: "#2D8A56" }, 
    { name: "DarkSeaGreen"                      , color: "#8EBB8E" }, 
    { name: "dark sea green"                    , color: "#8EBB8E" }, 
    { name: "DarkOliveGreen"                    , color: "#546A2E" }, 
    { name: "dark olive green"                  , color: "#546A2E" }, 
    { name: "DarkGreen"                         , color: "#006300" }, 
    { name: "dark green"                        , color: "#006300" }, 
    { name: "aquamarine"                        , color: "#7EFED3" }, 
    { name: "MediumAquamarine"                  , color: "#65CCA9" }, 
    { name: "medium aquamarine"                 , color: "#65CCA9" }, 
    { name: "CadetBlue"                         , color: "#5E9D9F" }, 
    { name: "cadet blue"                        , color: "#5E9D9F" }, 
    { name: "LightCyan"                         , color: "#DFFEFE" }, 
    { name: "light cyan"                        , color: "#DFFEFE" }, 
    { name: "cyan"                              , color: "#00FEFE" }, 
    { name: "turquoise"                         , color: "#3FDFCF" }, 
    { name: "MediumTurquoise"                   , color: "#47D0CB" }, 
    { name: "medium turquoise"                  , color: "#47D0CB" }, 
    { name: "DarkTurquoise"                     , color: "#00CDD0" }, 
    { name: "dark turquoise"                    , color: "#00CDD0" }, 
    { name: "PaleTurquoise"                     , color: "#AEEDED" }, 
    { name: "pale turquoise"                    , color: "#AEEDED" }, 
    { name: "PowderBlue"                        , color: "#AFDFE5" }, 
    { name: "powder blue"                       , color: "#AFDFE5" }, 
    { name: "LightBlue"                         , color: "#ACD7E5" }, 
    { name: "light blue"                        , color: "#ACD7E5" }, 
    { name: "LightSteelBlue"                    , color: "#AFC3DD" }, 
    { name: "light steel blue"                  , color: "#AFC3DD" }, 
    { name: "SteelBlue"                         , color: "#4581B3" }, 
    { name: "steel blue"                        , color: "#4581B3" }, 
    { name: "LightSkyBlue"                      , color: "#86CDF9" }, 
    { name: "light sky blue"                    , color: "#86CDF9" }, 
    { name: "skyblue"                           , color: "#86CDEA" }, 
    { name: "SkyBlue"                           , color: "#86CDEA" }, 
    { name: "sky blue"                          , color: "#86CDEA" }, 
    { name: "DeepSkyBlue"                       , color: "#00BEFE" }, 
    { name: "deep sky blue"                     , color: "#00BEFE" }, 
    { name: "DodgerBlue"                        , color: "#1D8FFE" }, 
    { name: "dodger blue"                       , color: "#1D8FFE" }, 
    { name: "blue"                              , color: "#0000FE" }, 
    { name: "RoyalBlue"                         , color: "#4068E0" }, 
    { name: "royal blue"                        , color: "#4068E0" }, 
    { name: "MediumBlue"                        , color: "#0000CC" }, 
    { name: "medium blue"                       , color: "#0000CC" }, 
    { name: "LightSlateBlue"                    , color: "#836FFE" }, 
    { name: "light slate blue"                  , color: "#836FFE" }, 
    { name: "MediumSlateBlue"                   , color: "#7A67ED" }, 
    { name: "medium slate blue"                 , color: "#7A67ED" }, 
    { name: "SlateBlue"                         , color: "#6959CC" }, 
    { name: "slate blue"                        , color: "#6959CC" }, 
    { name: "DarkSlateBlue"                     , color: "#473C8A" }, 
    { name: "dark slate blue"                   , color: "#473C8A" }, 
    { name: "CornflowerBlue"                    , color: "#6394EC" }, 
    { name: "cornflower blue"                   , color: "#6394EC" }, 
    { name: "NavyBlue"                          , color: "#00007F" }, 
    { name: "navy blue"                         , color: "#00007F" }, 
    { name: "navy"                              , color: "#00007F" }, 
    { name: "MidnightBlue"                      , color: "#18186F" }, 
    { name: "midnight blue"                     , color: "#18186F" }, 
    { name: "LightGray"                         , color: "#D2D2D2" }, 
    { name: "light gray"                        , color: "#D2D2D2" }, 
    { name: "LightGrey"                         , color: "#D2D2D2" }, 
    { name: "light grey"                        , color: "#D2D2D2" }, 
    { name: "grey"                              , color: "#BDBDBD" }, 
    { name: "gray"                              , color: "#BDBDBD" }, 
    { name: "LightSlateGrey"                    , color: "#768798" }, 
    { name: "light slate grey"                  , color: "#768798" }, 
    { name: "LightSlateGray"                    , color: "#768798" }, 
    { name: "light slate gray"                  , color: "#768798" }, 
    { name: "SlateGrey"                         , color: "#6F7F8F" }, 
    { name: "slate grey"                        , color: "#6F7F8F" }, 
    { name: "SlateGray"                         , color: "#6F7F8F" }, 
    { name: "slate gray"                        , color: "#6F7F8F" }, 
    { name: "DimGrey"                           , color: "#686868" }, 
    { name: "dim grey"                          , color: "#686868" }, 
    { name: "DimGray"                           , color: "#686868" }, 
    { name: "dim gray"                          , color: "#686868" }, 
    { name: "DarkSlateGrey"                     , color: "#2E4E4E" }, 
    { name: "dark slate grey"                   , color: "#2E4E4E" }, 
    { name: "DarkSlateGray"                     , color: "#2E4E4E" }, 
    { name: "dark slate gray"                   , color: "#2E4E4E" }, 
    { name: "black"                             , color: "#000000" }, 
    { name: "white"                             , color: "#FEFEFE" }, 
    { name: "MistyRose"                         , color: "#FEE3E0" }, 
    { name: "misty rose"                        , color: "#FEE3E0" }, 
    { name: "LavenderBlush"                     , color: "#FEEFF4" }, 
    { name: "lavender blush"                    , color: "#FEEFF4" }, 
    { name: "lavender"                          , color: "#E5E5F9" }, 
    { name: "AliceBlue"                         , color: "#EFF7FE" }, 
    { name: "alice blue"                        , color: "#EFF7FE" }, 
    { name: "azure"                             , color: "#EFFEFE" }, 
    { name: "MintCream"                         , color: "#F4FEF9" }, 
    { name: "mint cream"                        , color: "#F4FEF9" }, 
    { name: "honeydew"                          , color: "#EFFEEF" }, 
    { name: "seashell"                          , color: "#FEF4ED" }, 
    { name: "LemonChiffon"                      , color: "#FEF9CC" }, 
    { name: "lemon chiffon"                     , color: "#FEF9CC" }, 
    { name: "ivory"                             , color: "#FEFEEF" }, 
    { name: "cornsilk"                          , color: "#FEF7DB" }, 
    { name: "moccasin"                          , color: "#FEE3B4" }, 
    { name: "NavajoWhite"                       , color: "#FEDDAC" }, 
    { name: "navajo white"                      , color: "#FEDDAC" }, 
    { name: "PeachPuff"                         , color: "#FED9B8" }, 
    { name: "peach puff"                        , color: "#FED9B8" }, 
    { name: "bisque"                            , color: "#FEE3C3" }, 
    { name: "BlanchedAlmond"                    , color: "#FEEACC" }, 
    { name: "blanched almond"                   , color: "#FEEACC" }, 
    { name: "PapayaWhip"                        , color: "#FEEED4" }, 
    { name: "papaya whip"                       , color: "#FEEED4" }, 
    { name: "AntiqueWhite"                      , color: "#F9EAD6" }, 
    { name: "antique white"                     , color: "#F9EAD6" }, 
    { name: "linen"                             , color: "#F9EFE5" }, 
    { name: "OldLace"                           , color: "#FCF4E5" }, 
    { name: "old lace"                          , color: "#FCF4E5" }, 
    { name: "FloralWhite"                       , color: "#FEF9EF" }, 
    { name: "floral white"                      , color: "#FEF9EF" }, 
    { name: "gainsboro"                         , color: "#DBDBDB" }, 
    { name: "WhiteSmoke"                        , color: "#F4F4F4" }, 
    { name: "white smoke"                       , color: "#F4F4F4" }, 
    { name: "GhostWhite"                        , color: "#F7F7FE" }, 
    { name: "ghost white"                       , color: "#F7F7FE" }, 
    { name: "snow"                              , color: "#FEF9F9" },
];
