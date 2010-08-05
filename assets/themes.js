var picker;

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
	'     (font-lock-warning-face ((t (:foreground "Red" :bold t))))',
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
