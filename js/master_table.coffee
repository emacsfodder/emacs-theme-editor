App = App || {}

# Master table of faces for emacs themes
# We could add additional emacs faces here with
# regexes to find them.
# For the moment though we're keeping it basic.
#
# The el keys contain the css ids / classes, and the property names
# to color. (using the css convention)
#
App.master_table =
  background:
    rx: /background-color +\. +"([^"]*)"/
    rx24: /default +\(\(t +\(\(t +\(.*:background +"([^"]*)"/
    el: ['#code-sample', 'background-color']
  border:
    rx: /border-color +\. +"([^"]*)"/
    rx24: /fringe +\(\(t +\(\(t +\(.*:background +"([^"]*)"/
    el: ['#code-sample', 'border-color']
  cursor:
    rx: /cursor-color +\. +"([^"]*)"/
    rx24: /cursor +\(\(t +\(\(t +\(.*:background +"([^"]*)"/
    el: ['.cursor', 'background-color']
  foreground:
    rx: /foreground-color \. +"([^"]*)"/
    rx24: /default +\(\(t +\(\(t +\(.*:foreground +"([^"]*)"/
    el: ['#code-sample', 'color']
  modelinefg:
    rx: /mode-line +\(\(t +\(.*:foreground +"([^"]*)"/
    el: ['#modeline', 'color']
  modelinebg:
    rx: /mode-line +\(\(t +\(.*:background +"([^"]*)"/
    el: ['#modeline', 'background-color']
  prompt:
    # we ignore the background color of the minibuffer prompt.
    rx: /minibuffer-prompt +\(\(t +\(.*:foreground +"([^"]*)"/
    el: ['#prompt', 'color']
  region:
    # we ignore the foreground color of the region.
    rx: /region +\(\(t +\(.*:background +"([^"]*)"/
    el: ['.region', 'background-color']
  # we ignore the background color of the font-lock faces.
  builtin:
    rx: /font-lock-builtin-face +\(\(t +\(.*:foreground +"([^"]*)"/
    el: ['.builtin', 'color']
  comment:
    rx: /font-lock-comment-face +\(\(t +\(.*:foreground +"([^"]*)"/
    el: ['.comment', 'color']
  function:
    rx: /font-lock-function-name-face +\(\(t +\(.*:foreground +"([^"]*)"/
    el: ['.function', 'color']
  keyword:
    rx: /font-lock-keyword-face +\(\(t +\(.*:foreground +"([^"]*)"/
    el: ['.keyword', 'color']
  string:
    rx: /font-lock-string-face +\(\(t +\(.*:foreground +"([^"]*)"/
    el: ['.string', 'color']
  type:
    rx: /font-lock-type-face +\(\(t +\(.*:foreground +"([^"]*)"/
    el: ['.type', 'color']
  constant:
    rx: /font-lock-constant-face +\(\(t +\(.*:foreground +"([^"]*)"/
    el: ['.constant', 'color']
  variable:
    rx: /font-lock-variable-name-face +\(\(t +\(.*:foreground +"([^"]*)"/
    el: ['.variable', 'color']
