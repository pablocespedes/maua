collapseManager = ->
  new class CollapseManager
    constructor: () ->
      entries = []
    put : (id, isCollapsed) ->
      entry = @get(id)
      if entry
        entry.isCollapsed = isCollapsed
      else
        @entries.push
          id: id
          isCollapsed: isCollapsed
      return

    get : (id) ->
      _.find @entries, 'id': id

    isCollapsed : (id) ->
      entry = @get(id)
      if entry then entry.isCollapsed else false

    collapsedCount : ->
      _.filter(@entries, 'isCollapsed': true).length

    areAllCollapsed : ->
      @collapsedCount() == @entries.length

    lastEntry : ->
      _.last @entries

    isLastEntry : (id) ->
      lastEntry = @lastEntry()
      if lastEntry then lastEntry.id == id else false

    reset : ->
      @entries = []
      return

module.exports = collapseManager