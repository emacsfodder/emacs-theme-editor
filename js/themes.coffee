# Emacs Theme Editor 2015
closeThemeBox = ()->
  $('#config').hide()
  $('#config .msg').remove()
  $('#generate').removeAttr 'disabled'

$ ()->

  $.get './js/theme-selector.handlebars', (file)->
    template = Handlebars.compile file
    $('#theme-selector').html template themes: themes

  $.get './js/face-list.handlebars', (file)->
    template = Handlebars.compile file
    list = getFaceList App.master_table
    $('#face-list').html template list

    $('input.els').spectrum
      clickoutFiresChange: true
      showInitial: true
      showInput: true
      preferredFormat: "hex"
      chooseText: "Set"
      cancelText: "Reset"
      move: (color)->
        setColor this.name, color.toHexString()

  .then ->
    $.get './js/python.handlebars', (file)->
      template = Handlebars.compile file
      $('#code-sample').html template App.code_spans
    .then ->
      setTheme dark_theme


  updateUserThemes() if _.keys(localStorage).length > 0

  $(document).on 'click', '#generate', themeGenerator
