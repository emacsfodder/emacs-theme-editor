# Emacs Theme Editor 2015
closeThemeBox = ()->
  $('#config').hide()
  $('#config .msg').remove()
  $('#generate').removeAttr 'disabled'

code_spans =
  kw: '<span class="keyword">'
  cm: '<span class="comment">'
  bi: '<span class="builtin">'
  ty: '<span class="type">'
  va: '<span class="variable">'
  co: '<span class="constant">'
  st: '<span class="string">'
  fn: '<span class="function">'
  rg: '<span class="region">'
  cu: '<span class="cursor">'
  sx: '</span>'

$ ()->

  $.get './js/python.handlebars', (file)->
    template = Handlebars.compile file
    $('#code-sample').html template code_spans
  .then ()->
    setTheme dark_theme

  $.get './js/theme-selector.handlebars', (file)->
    template = Handlebars.compile file
    $('#theme-selector').html template themes: themes

  $('input.els').spectrum
    clickoutFiresChange: true
    showInitial: true
    showInput: true
    preferredFormat: "hex"
    chooseText: "Set"
    cancelText: "Reset"
    move: (color)->
      setColor this.name, color.toHexString()

  updateUserThemes() if _.keys(localStorage).length > 0

  # $(document).keydown (e)->
  #   if e.keyCode == 27
  #     e.preventDefault()
  #     closeThemeBox()

  # $(document).on 'click', '#close', (e)->
  #   e.preventDefault()
  #   closeThemeBox()

  $(document).on 'click', '#generate', themeGenerator
