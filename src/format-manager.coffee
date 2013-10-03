ScribeFormat  = require('./format')


class ScribeFormatManager
  @DEFAULTS:
    formats: ['bold', 'italic', 'strike', 'underline', 'link', 'back-color', 'family', 'fore-color', 'size']

  constructor: (@container, options = {}) ->
    @options = _.defaults(options.formatManager or {}, ScribeFormatManager.DEFAULTS)
    @formats = {}
    _.each(@options.formats, (formatName) =>
      className = _.str.classify(formatName)
      this.addFormat(formatName, new ScribeFormat[className](@container))
    )

  addFormat: (name, format) ->
    @formats[name] = format

  createFormatContainer: (name, value) ->
    if @formats[name]
      return @formats[name].createContainer(value)
    else
      return @container.ownerDocument.createElement('SPAN')

  getFormat: (container) ->
    for name,format of @formats
      value = format.matchContainer(container)
      return [name, value] if value
    return []


module.exports = ScribeFormatManager
