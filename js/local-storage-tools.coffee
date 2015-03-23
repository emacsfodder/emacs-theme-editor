userThemes = {}

updateUserThemes = ()->
  $('#user-themes').empty()

  _.each _.keys(userThemes), (k)->
    delete userThemes[k]

  _.each _.keys(localStorage), (t)->
    if localStorage.getItem t
      userThemes[t] = localStorage.getItem t

  if _.keys(userThemes).length > 0
    $.get './js/templates/user-themes.handlebars', (file)->
      template = Handlebars.compile file
      $('#user-themes').html template userThemes: userThemes

saveToLocalStorage = ()->
  name = $('#theme-name').val()
  unless name
    name = prompt "Save theme", "untitled"
  return unless name
  $('#theme-name').val(name)
  if localStorage.getItem name
    @undoTheme = localStorage.getItem name
  localStorage.setItem name, JSON.stringify App.liveTheme
  updateUserThemes()

removeTheme = (name)->
  if confirm "Remove theme #{name}"
    if localStorage.getItem name
      @undoTheme = localStorage.getItem name
    localStorage.removeItem name
    updateUserThemes()
