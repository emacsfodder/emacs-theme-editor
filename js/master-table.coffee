App = App || {}

# Master table of faces for emacs themes
# We could add additional emacs faces here with
# regexes to find them.
# For the moment though we're keeping it basic.
#
# The el keys contain the css ids / classes, and the property names
# to color. (using the css convention)

App.code_spans =
  kw: '<span class="keyword">'
  cm: '<span class="comment">'
  bi: '<span class="builtin">'
  ty: '<span class="type">'
  va: '<span class="variable">'
  co: '<span class="constant">'
  st: '<span class="string">'
  fn: '<span class="function">'
  rg: '<span class="region">'
  ss: '<span class="secondary-selection">'
  cu: '<span class="cursor">'
  sx: '</span>'

App.master_table =
  background:
    id: "rbg"
    title: "Background"
    rx: /background-color +\. +"([^"]*)"/
    rx24: /default +\(\(t +\(\(t +\(.*:background +"([^"]*)"/
    el: ['.default', 'background-color']
  foreground:
    id: "rfg"
    title: "Foreground"
    rx: /foreground-color \. +"([^"]*)"/
    rx24: /default +\(\(t +\(\(t +\(.*:foreground +"([^"]*)"/
    el: ['.default', 'color']
  keyword:
    id: "rkw"
    title: "Keywords"
    rx: /font-lock-keyword-face +\(\(t +\(.*:foreground +"([^"]*)"/
    el: ['.keyword', 'color']
  comment:
    id: "rcmt"
    title: "Comments"
    rx: /font-lock-comment-face +\(\(t +\(.*:foreground +"([^"]*)"/
    el: ['.comment', 'color']
  builtin:
    id: "rbt"
    title: "Builtins"
    rx: /font-lock-builtin-face +\(\(t +\(.*:foreground +"([^"]*)"/
    el: ['.builtin', 'color']
  type:
    id: "rtp"
    title: "Class/Type"
    rx: /font-lock-type-face +\(\(t +\(.*:foreground +"([^"]*)"/
    el: ['.type', 'color']
  variable:
    id: "rvar"
    title: "Variables"
    rx: /font-lock-variable-name-face +\(\(t +\(.*:foreground +"([^"]*)"/
    el: ['.variable', 'color']
  constant:
    id: "rconst"
    title: "Constants"
    rx: /font-lock-constant-face +\(\(t +\(.*:foreground +"([^"]*)"/
    el: ['.constant', 'color']
  string:
    id: "rstr"
    title: "Strings"
    rx: /font-lock-string-face +\(\(t +\(.*:foreground +"([^"]*)"/
    el: ['.string', 'color']
  function:
    id: "rfun"
    title: "Functions"
    rx: /font-lock-function-name-face +\(\(t +\(.*:foreground +"([^"]*)"/
    el: ['.function', 'color']
  cursor:
    id: "rcr"
    title: "Cursor"
    rx: /cursor-color +\. +"([^"]*)"/
    rx24: /cursor +\(\(t +\(\(t +\(.*:background +"([^"]*)"/
    el: ['.cursor', 'background-color']
  region:
    id: "reg"
    title: "Region"
    rx: /region +\(\(t +\(.*:background +"([^"]*)"/
    el: ['.region', 'background-color']
  secondary:
    id: "rss"
    title: "Secondary Selection"
    rx: /secondary-selection +\(\(t +\(.*:background +"([^"]*)"/
    el: ['.secondary-selection', 'background-color']
  border:
    id: "rbd"
    title: "Fringe"
    rx: /border-color +\. +"([^"]*)"/
    rx24: /fringe +\(\(t +\(\(t +\(.*:background +"([^"]*)"/
    el: ['.fringe', 'border-color']
  modelinebg:
    id: "modbg"
    title: "Modeline bg"
    rx: /mode-line +\(\(t +\(.*:background +"([^"]*)"/
    el: ['.modeline', 'background-color']
  modelinefg:
    id: "modfg"
    title: "Modeline fg"
    rx: /mode-line +\(\(t +\(.*:foreground +"([^"]*)"/
    el: ['.modeline', 'color']
  prompt:
    id: "pmp"
    title: "Minibuffer"
    rx: /minibuffer-prompt +\(\(t +\(.*:foreground +"([^"]*)"/
    el: ['.prompt', 'color']

getFaceList = (t)->
  _.keys(t).map (k)->
    name:   k
    id:     t[k].id
    title:  t[k].title
