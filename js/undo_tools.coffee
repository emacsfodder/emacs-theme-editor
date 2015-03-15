## TODO: Implement UI for undo facility.
#
## TODO: Implement undo saves for color changes.  interface with
##       Spectrum to get the previous color.
undo_theme = {}

setUndoKey = (k, v)->
  undo = JSON.parse @undo_theme
  undo[k] = v
  @undo_theme = JSON.stringify undo

setUndoLive = ()->
  @undo_theme = JSON.stringify App.live_theme

undo = ()->
  setTheme @undo_theme
  setTheme @undo_theme
