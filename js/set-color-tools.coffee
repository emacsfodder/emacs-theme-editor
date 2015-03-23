App = App || {}
App.liveTheme = {}

masterKeys = ()->
  _.keys App.faceTable

elp = (k)->
  App.faceTable[k].el[1]

getColor = (k)->
  tinycolor($(App.faceTable[k].el[0]).css elp(k)).toHexString()

setColor = (k, col)->
  $(App.faceTable[k].el[0]).css elp(k), col
  $("input[name=#{k}]").spectrum "set", col
  $("input[name=#{k}]").val(col)
  App.liveTheme[k] = col

setTheme = (themeJson, name=null)->
  return unless themeJson
  o = JSON.parse themeJson
  _.each _.keys(o), (k)->
    setColor k, o[k]
  $('#theme-name').val(name) if name
