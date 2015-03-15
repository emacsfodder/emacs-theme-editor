# This method will remove N leading spaces from a multiline string.
# Processing each line.
String::undent = (n=null)->
  lines = this.split("\n")
  # bail if there lines are non-existent
  return if lines.length == 0
  # when N isn't supplied, determine N from the shortest indent
  # in the given string.
  #
  # 1. Filter out any blank lines before processing
  # 2. Map a list of the indent lengths (IL)
  # 3. Sort the the list of lengths and take the first
  unless n
    n = lines.filter (l)-> !l.match /^ *$/
    .map (l)->
      l.match("^ *")[0].length
    .sort()[0]

  rx = RegExp "^ {#{n}}"
  lines.map (line)->
    line.replace(rx, '')
  .join("\n")
