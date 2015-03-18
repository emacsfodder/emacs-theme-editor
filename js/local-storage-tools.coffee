user_themes = {}

updateUserThemes = ()->
  $('#user-themes').empty()

  _.each _.keys(user_themes), (k)->
    delete user_themes[k]

  _.each _.keys(localStorage), (t)->
    if localStorage.getItem t
      user_themes[t] = localStorage.getItem t

  if _.keys(user_themes).length > 0
    $.get './js/templates/user-themes.handlebars', (file)->
      template = Handlebars.compile file
      $('#user-themes').html template user_themes: user_themes

saveToLocalStorage = ()->
  name = $('#theme-name').val()
  unless name
    name = prompt "Save theme", "untitled"
  return unless name
  $('#theme-name').val(name)
  if localStorage.getItem name
    @undo_theme = localStorage.getItem name
  localStorage.setItem name, JSON.stringify App.live_theme
  updateUserThemes()

removeTheme = (name)->
  if confirm "Remove theme #{name}"
    if localStorage.getItem name
      @undo_theme = localStorage.getItem name
    localStorage.removeItem name
    updateUserThemes()
