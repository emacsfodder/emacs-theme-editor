var picker;

var foregroundRegEx = /foreground-color \. "([^"]*)"/;
var builtinRegEx = /font-lock-builtin-face \(\(t \(:foreground "([^"]*)"/;
var commentRegEx = /font-lock-comment-face \(\(t \(:foreground "([^"]*)"/;
var keywordRegEx = /font-lock-keyword-face \(\(t \(:foreground "([^"]*)"/;
var variableRegEx = /font-lock-variable-name-face \(\(t \(:foreground "([^"]*)"/;
var constantRegEx = /font-lock-constant-face \(\(t \(:foreground "([^"]*)"/;
var stringRegEx = /font-lock-string-face \(\(t \(:foreground "([^"]*)"/;
var typeRegEx = /font-lock-type-face \(\(t \(:foreground"([^"]*)"/;
var functionRegEx = /font-lock-function-name-face \(\(t \(:foreground "([^"]*)"/;
var borderRegEx = /border-color \. "([^"]*)"/;
var backgroundRegEx = /background-color \. "([^"]*)"/;
var modelinebgRegEx = /mode-line \(\(t \(:foreground "[^"]*" :background "([^"]*)"/;
var modelinefgRegEx = /mode-line \(\(t \(:foreground "([^"]*)" :background "[^"]*"/;
var cursorRegEx = /cursor-color \. "([^"]*)"/;
var promptRegEx = /minibuffer-prompt \(\(t \(:foreground "([^"]*)"/;
var regionRegEx = /region \(\(t \(:background "([^"]*)"/;

var all = {
    "foreground": ["#frame", "color"],
    "builtin": [".builtin", "color"],
    "comment": [".comment", "color"],
    "keyword": [".keyword", "color"],
    "variable": [".variable", "color"],
    "constant": [".constant", "color"],
    "string": [".string", "color"],
    "type": [".type", "color"],
    "function": [".function", "color"],
    "border": ["#frame", "border-color", "borderLeftColor"],
    "background": ["#frame", "background-color", "backgroundColor"],
    "modelinebg": ["#modeline", "background-color", "backgroundColor"],
    "modelinefg": ["#modeline", "color"],
    "cursor": ["#cursor", "background-color", "backgroundColor"],
    "prompt": ["#prompt", "color"],
    "region": [".region", "background-color", "backgroundColor"]
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
	$('<textarea class="confarea">' + getConfig() + '</textarea>').appendTo('#config');
	$("<p class='msg'>After that, put this into your .emacs:</p><pre class='msg'>(require 'color-theme)<br/>(color-theme-initialize)<br/>(your-config-name)<br/></pre><br><span class='msg'>and you're done.</span>").appendTo('#config');

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

function loadConfig(conf) {

    $('#configname').val(conf.match(/defun ([^ ]*)/)[1]);

    var background, border, cursor, foreground, modelinefg, modelinebg, region, builtin, comment, functionName, keyword, string, type, constant, variable, prompt;

    try {background = conf.match( backgroundRegEx )[1];} catch (err){}
    try {border = conf.match( borderRegEx)[1];} catch (err){}
    try {cursor = conf.match( cursorRegEx )[1];} catch (err){}
    try {foreground = conf.match( foregroundRegEx )[1];} catch (err){}
    try {modelinefg = conf.match( modelinefgRegEx )[1];} catch (err){}
    try {modelinebg = conf.match( modelinebgRegEx )[1];} catch (err){}
    try {region = conf.match( regionRegEx )[1];} catch (err){}
    try {builtin = conf.match( builtinRegEx )[1];} catch (err){}
    try {comment = conf.match( commentRegEx )[1];} catch (err){}
    try {functionName = conf.match( functionRegEx )[1];} catch (err){}
    try {keyword = conf.match( keywordRegEx )[1];} catch (err){}
    try {string = conf.match( stringRegEx )[1];} catch (err){}
    try {type = conf.match( typeRegEx )[1];} catch (err){}
    try {constant = conf.match( constantRegEx )[1];} catch (err){}
    try {variable = conf.match( variableRegEx )[1];} catch (err){}
    try {prompt = conf.match( promptRegEx )[1];} catch (err){}

    var all = {
    	'background':background,
    	'border':border,
    	'cursor':cursor,
    	'foreground':foreground,
    	'modelinefg':modelinefg,
    	'modelinebg':modelinebg,
    	'region':region,
    	'builtin':builtin, 
    	'comment':comment,
    	'function':functionName,
    	'keyword':keyword,
    	'string':string,
    	'type':type,
    	'constant':constant,
    	'variable':variable,
    	'prompt':prompt
    };

    setTheme(all);
}

function getConfig() {
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
    ];
    return conf.join('\n');
}


var themes = [
    {'foreground':'#000', 'builtin':'#f820b4', 'comment':'#7d827d', 'keyword':'#b415c1', 'variable':'#e6a00f', 'constant':'#e6a00f', 'string':'#c77429', 'type':'#199915',
     'function':'#102cc1', 'region':'#666666', 'border':'#969696', 'background':'#f0f0f0', 'modelinefg':'#ffffff', 'modelinebg':'#595959', 'cursor':'#000000', 'prompt':'#7299ff'},

    {'foreground':'#eeeeec', 'builtin':'#729fcf', 'comment':'#888a85', 'keyword':'#729fcf', 'variable':'#eeeeec', 'constant':'#e6a00f', 'string':'#ad7fa8', 'type':'#8ae234',
     'function':'#edd400', 'region':'#0d4519', 'border':'#1a1a1a', 'background':'#101e2e', 'modelinefg':'#eeeeec', 'modelinebg':'#555753', 'cursor':'#fce94f', 'prompt':'#729fcf'}
]


function setTheme(dict) {
    for (each in dict) {
	setcol(each, dict[each]);
    }
}
