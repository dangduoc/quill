ScribeEditor      = require('./src/editor')
ScribeAttribution = require('./src/modules/attribution')
ScribeColorPicker = require('./src/modules/color-picker')
ScribeLinkTooltip = require('./src/modules/link-tooltip')
ScribeMultiCursor = require('./src/modules/multi-cursor')
ScribeToolbar     = require('./src/modules/toolbar')

window.Scribe =
  version     : '0.9.2'
  Attribution : ScribeAttribution
  ColorPicker : ScribeColorPicker
  Editor      : ScribeEditor
  LinkTooltip : ScribeLinkTooltip
  MultiCursor : ScribeMultiCursor
  Toolbar     : ScribeToolbar