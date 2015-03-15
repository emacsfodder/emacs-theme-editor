abstractGenerator = (name, template, ctx)->
  $.get(template).then (t)->
    o = _.extend {name: name}, ctx
    compiled = Handlebars.compile t
    return compiled o

# for GNU Emacs 24+
generateDeftheme = (name)->
  abstractGenerator name, './js/deftheme.handlebars', App.live_theme

# for color-theme.el package
generateColorTheme = (name)->
  abstractGenerator name, './js/color-theme.handlebars', App.live_theme

themeGenerator = ->
  $('#generate').attr 'disabled', 'disabled'
  $('#generate').blur()
  name = $('#configname').val()
  unless name
    name = prompt "Save theme", "untitled"
    $('#configname').val(name)

  deftheme = $('#deftheme')[0].checked

  [template, generator] = if deftheme
    ['./js/deftheme-modal.handlebars', generateDeftheme]
  else
    ['./js/color-theme-modal.handlebars', generateColorTheme]

  generator(name).then (generated)->
    $.get template, (file)->
      compiled = Handlebars.compile file
      c = compiled generated: generated, name: name
      $('#config').html c
      $('#config-panel').show()
