let utilsService = require('src/services/utils-service.js');
/// Get the panels which should be loaded
/// for a panel of a given index, including
/// the panel with the matching index, and
/// the buffering panels.
/// todo: possibly add parameter validation.
module.exports = {
  getPanelsToLoad: function(panelIndex,
                            stripIndex,
                            panelsMap,
                            strip,
                            stripsData,
                            bufferSize) {
    var panelsToLoad = [];
    const globalPanelIndex = strip.startPanelIndex + panelIndex;

    // Get the start index of the range of
    // panels to load.
    var panelsToLoadStartIndex = Math.max(0, globalPanelIndex - bufferSize);

    // Get the end index of the range of
    // panels to load.
    var panelsToLoadEndIndex = Math.min(panelsMap.length - 1, globalPanelIndex + bufferSize);
    if (this.panelIsLast(stripIndex, panelIndex, stripsData)) {
      panelsToLoadStartIndex = panelsToLoadStartIndex -1;
    }

    for (var i = panelsToLoadStartIndex; i <= panelsToLoadEndIndex; i++) {
      var panelMap = panelsMap[i];
      // Get the actual panel from the strip
      // and panel indexes in the panel map object
      const panelToLoad = stripsData[panelMap.stripIndex].panels[panelMap.panelIndex];
      panelsToLoad.push(panelToLoad);
    }

    return panelsToLoad;
  },
  panelIsLast(stripIndex, panelIndexInStrip, stripsData) {
    var strip = stripsData[stripIndex];
    return stripIndex === stripsData.length - 1 &&
          panelIndexInStrip === strip.panels.length - 1;
  },
  panelIsFirst(stripIndex, panelIndexInStrip) {
    return panelIndexInStrip === 0 &&
          stripIndex === 0;
  },
  getPanelIndexFromPanelNumber: function(strip, panelNumber) {
    var panelIndex = utilsService.isInt(panelNumber) ? panelNumber - 1 : 0;
    return panelIndex > strip.panels.length - 1 ? 0 : panelIndex;
  },
  /// Create an array which maps panels to their strip
  createMaps: function (strips) {
    const panelsMap = [];
    const urlNamesMap = {};
    var panelLoopIndex = 0;
    for (var i = 0; i < strips.length; i++) {
      const strip = strips[i];
      urlNamesMap[strip.urlName] = i;
      strip.startPanelIndex = panelLoopIndex;
      for (var j = 0; j < strip.panels.length; j++) {
        panelsMap.push({stripIndex: i, panelIndex: j});
        strip.panels[j].panelSort = panelLoopIndex;
        panelLoopIndex++;
      }
    }
    return { panelsMap, urlNamesMap };
  }
}