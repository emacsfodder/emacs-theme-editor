generateDeftheme = (name)->
  $.get('./js/templates/deftheme.handlebars').then (t)->
    o = _.extend {name: name}, App.live_theme
    compiled = Handlebars.compile t
    return compiled o

themeGenerator = ->
  name = $('#theme-name').val()
  unless name
    name = prompt "Generate theme", "untitled"
    $('#theme-name').val(name)

  generateDeftheme(name).then (generated)->
    App.generated_theme = generated
    App.generated_theme_name = "#{name}-theme.el"
    $.get './js/templates/deftheme-panel.handlebars', (file)->
      compiled = Handlebars.compile file
      ctx =
        generated: generated
        name: name
      c = compiled ctx
      $('#theme-generated').html c
      smoothScroll.animateScroll null, '#theme-generated'

saveCurrentTheme = ()->
  return unless App.generated_theme && App.generated_theme_name
  text_blob = new Blob([App.generated_theme], {type:'text/plain'});
  download_link = document.createElement("a")
  download_link.download = App.generated_theme_name
  # download_link.innerHTML = ""
  if (window.webkitURL != null)
    # Chrome can click the link without it being in the DOM
    download_link.href = window.webkitURL.createObjectURL text_blob
  else
    # Others cannot
    download_link.href = window.URL.createObjectURL text_blob
    download_link.onclick = (e)-> document.body.removeChild e.target
    download_link.style.display = "none"
    document.body.appendChild download_link
  download_link.click()
