# Emacs Theme Editor 2015
closeThemeBox = ()->
  $('#theme-generated').hide()
  $('#theme-generated .msg').remove()
  $('#generate').removeAttr 'disabled'

# Initialize
$ ()->

  smoothScroll.init
    speed: 500
    easing: 'easeInCubic'
    updateURL: false
    offset: 0

  $('[data-toggle=tooltip]').tooltip
    placement: 'top'

  $.get './js/templates/theme-selector.handlebars', (file)->
    template = Handlebars.compile file
    $('#theme-selector').html template themes: themes

  $.get './js/templates/face-list.handlebars', (file)->
    template = Handlebars.compile file
    list = getFaceList App.face_table
    $('#face-list').html template list

    $('input.els').spectrum
      clickoutFiresChange: true
      showInitial: true
      showInput: true
      preferredFormat: "hex"
      chooseText: "Set"
      cancelText: "Reset"
      change: (color)->
        console.log "Change event from spectrum", color
      move: (color)->
        setColor this.name, color.toHexString()

  .then ->
    $.get './js/templates/python.handlebars', (file)->
      template = Handlebars.compile file
      $('#code-sample').html template App.code_spans
    .then ->
      setTheme dark_theme

  updateUserThemes() if _.keys(localStorage).length > 0

  $(document).on 'click', '#generate', themeGenerator
