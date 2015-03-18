abstractGenerator = (name, template, ctx)->
  $.get(template).then (t)->
    o = _.extend {name: name}, ctx
    compiled = Handlebars.compile t
    return compiled o

# for GNU Emacs 24+
generateDeftheme = (name)->
  abstractGenerator name,
  './js/templates/deftheme.handlebars',
  App.live_theme

# for color-theme.el package
generateColorTheme = (name)->
  abstractGenerator name,
  './js/templates/color-theme.handlebars',
  App.live_theme

themeGenerator = ->
  # $('#generate').attr 'disabled', 'disabled'
  # $('#generate').blur()
  name = $('#theme-name').val()
  unless name
    name = prompt "Generate theme", "untitled"
    $('#theme-name').val(name)

  deftheme = $('#deftheme')[0].checked

  [template, generator] = if deftheme
    ['./js/templates/deftheme-panel.handlebars', generateDeftheme]
  else
    ['./js/templates/color-theme-panel.handlebars', generateColorTheme]

  generator(name).then (generated)->
    $.get template, (file)->
      compiled = Handlebars.compile file
      ctx =
        generated: generated
        name: name
      c = compiled ctx
      $('#theme-generated').html c
      smoothScroll.animateScroll null, '#theme-generated'
