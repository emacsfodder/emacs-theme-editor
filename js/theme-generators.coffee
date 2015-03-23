generateDeftheme = (name)->
  $.get('./js/templates/deftheme.handlebars').then (t)->
    o = _.extend {name: name}, App.liveTheme
    compiled = Handlebars.compile t
    return compiled o

themeGenerator = ->
  name = $('#theme-name').val()
  unless name
    name = prompt "Generate theme", "untitled"
    $('#theme-name').val(name)

  generateDeftheme(name).then (generated)->
    App.generatedTheme = generated
    App.generatedThemeName = "#{name}-theme.el"
    $.get './js/templates/deftheme-panel.handlebars', (file)->
      compiled = Handlebars.compile file
      ctx =
        generated: generated
        name: name
      c = compiled ctx
      $('#theme-generated').html c
      smoothScroll.animateScroll null, '#theme-generated'

saveCurrentTheme = ()->
  return unless App.generatedTheme && App.generatedThemeName
  textBlob = new Blob([App.generatedTheme], {type:'text/plain'});
  downloadLink = document.createElement("a")
  downloadLink.download = App.generatedThemeName
  # downloadLink.innerHTML = ""
  if (window.webkitURL != null)
    # Chrome can click the link without it being in the DOM
    downloadLink.href = window.webkitURL.createObjectURL textBlob
  else
    # Others cannot
    downloadLink.href = window.URL.createObjectURL textBlob
    downloadLink.onclick = (e)-> document.body.removeChild e.target
    downloadLink.style.display = "none"
    document.body.appendChild downloadLink
  downloadLink.click()
