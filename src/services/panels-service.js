let utilsService = require('src/services/utils-service.js');
/// Get the panels which should be loaded
/// for a panel of a given index, including
/// the panel with the matching index, and
/// the buffering panels.
/// todo: possibly add parameter validation.
module.exports = {
  getPanelsToLoad: function(panelsMap,
                            globalPanelIndex,
                            stripsData,
                            bufferSize) {
    var panelsToLoad = [];
    
    // Get the start index of the range of
    // panels to load.
    var panelsToLoadStartIndex = Math.max(0, globalPanelIndex - bufferSize);

    // Get the end index of the range of
    // panels to load.
    var panelsToLoadEndIndex = Math.min(panelsMap.length - 1, globalPanelIndex + bufferSize);

    for (var i = panelsToLoadStartIndex; i <= panelsToLoadEndIndex; i++) {
      var panelMap = panelsMap[i];
      // Get the actual panel from the strip
      // and panel indexes in the panel map object
      const panelToLoad = stripsData[panelMap.stripIndex].panels[panelMap.panelIndex];
      // Clone the panel because we will be adding properties
      // and we don't want to change the base data.
      const panelToLoadClone = JSON.parse(JSON.stringify(panelToLoad));
      panelToLoadClone.isCurrentPanel = i === globalPanelIndex;
      panelToLoadClone.key = i;
      panelsToLoad.push(panelToLoadClone);
    }

    return panelsToLoad;
  },
  /// Determines if a given panel index is the
  /// first in the overall list of panels
  panelIsLast(stripIndex, panelIndexInStrip, stripsData) {
    var strip = stripsData[stripIndex];
    return stripIndex === stripsData.length - 1 &&
          panelIndexInStrip === strip.panels.length - 1;
  },
  /// Determines if a given panel index is the
  /// first in the overall list of panels.
  panelIsFirst(stripIndex, panelIndexInStrip) {
    return panelIndexInStrip === 0 &&
          stripIndex === 0;
  },
  /// Convert the one-based, string panel number route value
  /// to a zero-based integer panel index.
  getPanelIndexFromPanelNumber: function(strip, panelNumber) {
    if (!utilsService.isInt(panelNumber)) {
      return 0;
    }
    const panelNumberInt = parseInt(panelNumber);

    if (panelNumberInt < 0) {
      return 0;
    }

    return panelNumberInt > strip.panels.length ? 0 : panelNumberInt - 1;
  },
  /// Create an array which maps panels to their strip
  /// and a hash set object which maps url names to strips.
  createMaps: function (strips) {
    const panelsMap = [];
    const urlNamesMap = {};
    var panelLoopIndex = 0;
    for (var i = 0; i < strips.length; i++) {
      const strip = strips[i];
      urlNamesMap[strip.urlName] = {
        stripIndex: i,
        startPanelGlobalIndex: panelLoopIndex
      };
      for (var j = 0; j < strip.panels.length; j++) {
        panelsMap.push({stripIndex: i, panelIndex: j});
        panelLoopIndex++;
      }
    }
    return { panelsMap, urlNamesMap };
  },
  getNextPanelPath: function(currentPanelIsLast,
                             currentStripIndex,
                             currentPanelIndexInStrip,
                             strips) {
    if (currentPanelIsLast) {
      return '';
    }
    var currentStrip = strips[currentStripIndex];
    if (currentPanelIndexInStrip === currentStrip.panels.length - 1) {
      return '/' + strips[currentStripIndex + 1].urlName + '/panels/1'
    }
    return '/' + currentStrip.urlName + '/panels/' + (currentPanelIndexInStrip + 2);
  }
}
