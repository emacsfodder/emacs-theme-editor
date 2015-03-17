App = App || {}
App.live_theme = {}

masterKeys = ()->
  _.keys App.master_table

elp = (k)->
  App.master_table[k].el[1]

getColor = (k)->
  tinycolor($(App.master_table[k].el[0]).css elp(k)).toHexString()

setColor = (k, col)->
  $(App.master_table[k].el[0]).css elp(k), col
  $("input[name=#{k}]").spectrum "set", col
  $("input[name=#{k}]").val(col)
  App.live_theme[k] = col

setTheme = (theme_json, name=null)->
  return unless theme_json
  o = JSON.parse theme_json
  _.each _.keys(o), (k)->
    setColor k, o[k]
  $('#configname').val(name) if name
