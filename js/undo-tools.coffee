## TODO: Implement UI for undo facility.
#
## TODO: Implement undo saves for color changes.  interface with
##       Spectrum to get the previous color.
undoTheme = {}

setUndoKey = (k, v)->
  undo = JSON.parse @undoTheme
  undo[k] = v
  @undoTheme = JSON.stringify undo

setUndoLive = ()->
  @undoTheme = JSON.stringify App.liveTheme

undo = ()->
  setTheme @undoTheme
  setTheme @undoTheme
