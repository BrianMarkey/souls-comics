import Vue from 'vue'
import Comic from 'src/Comic.vue'

function getComponentWithData (propsData) {
  const constructor = Vue.extend(Comic);
  return new constructor({ propsData: propsData }).$mount();
}

const dataFactory = {
  createData: function () {
    var stripsData =  [
      {
        "name": "Test strip one.",
        "panels": [
          {
            "type": "video",
            "source": "strip1-panel1"
          },
          {
            "type": "video",
            "source": "strip1-panel2"
          },
          {
            "type": "video",
            "source": "strip1-panel3"
          }
        ]
      },
      {
        "name": "Test strip two.",
        "panels": [
          {
            "type": "video",
            "source": "strip2-panel1"
          },
          {
            "type": "video",
            "source": "strip2-panel2"
          },
          {
            "type": "video",
            "source": "strip2-panel3"
          }
        ]
      }
    ];
    var getPanelsToLoadPanelsMap = [];

    var panelLoopIndex = 0;
    for (var i = 0; i < stripsData.length; i++) {
      var strip = stripsData[i];
      strip.startPanelIndex = panelLoopIndex;
      for (var j = 0; j < strip.panels.length; j++) {
        getPanelsToLoadPanelsMap.push({stripIndex: i, panelIndex: j});
        strip.panels[j].panelSort = panelLoopIndex;
        panelLoopIndex++;
      }
    }

    return {
      stripsData: stripsData,
      mapData: getPanelsToLoadPanelsMap
    };
  }
}

describe("comic component", function() {

  it("exists", function() {
    expect(Comic).toBeDefined();
  });

  it("has a beforeMount function", function() {
    expect(typeof Comic.beforeMount).toBe('function');
  });

  it("has a data function", function() {
    expect(typeof Comic.data).toBe('function');
  });

  it("can execute the data function", function() {
    var data = Comic.data();
    expect(data).toBeDefined();
  });

});

// describe("comic.getPanel()", function() {
//   it("returns the correct panel", function() {
//     var component = getComponentWithData(data);
//     var source = component.getPanel(0,0).source;
//     expect(source).toBe("https://giant.gfycat.com/FlimsySpottedAmericancrocodile.webm");
//   });
  
//   it("returns null if the strip doesn't exist", function() {
//     var component = getComponentWithData(data);
//     var panel = component.getPanel(data.strips.length, 0);
//     expect(panel).toBe(null);
//   });
  
//   it("returns null if the panel doesn't exist", function() {
//     var stripIndex = 0;
//     var nonExistentPanelIndex = data.strips[stripIndex].panels.length;
//     var component = getComponentWithData(data);
//     var panel = component.getPanel(stripIndex, nonExistentPanelIndex);
//     expect(panel).toBe(null);
//   });
  
//   it("returns null if only one parameter is passed", function() {
//     var component = getComponentWithData(data);
//     var panel = component.getPanel(0);
//     expect(panel).toBe(null);
//   });
  
//   it("returns null if no parameters are passed", function() {
//     var component = getComponentWithData(data);
//     var panel = component.getPanel();
//     expect(panel).toBe(null);
//   });
// });

describe("comic.getPanelsToLoad()", function() {
  var data = null;

  beforeEach(function() {
    data = dataFactory.createData();
  });

  // // ...    
  // // ||||||
  it("returns the appropriate 3 panels when the buffer size is 1", function() {
    var component = getComponentWithData({strips: data.stripsData, stripNumber: 1});
    var loadedPanels = component.getPanelsToLoad(1, data.mapData, data.stripsData, 1);
    expect(loadedPanels.length).toBe(3);
    expect(loadedPanels[0].source).toBe(data.stripsData[0].panels[0].source);
    expect(loadedPanels[1].source).toBe(data.stripsData[0].panels[1].source);
    expect(loadedPanels[2].source).toBe(data.stripsData[0].panels[2].source);
  });

  // ...    
  // ||||||
  it("returns the appropriate 3 panels when the buffer size is 1", function() {
    var component = getComponentWithData({strips: data.stripsData, stripNumber: 1});
    var loadedPanels = component.getPanelsToLoad(1, data.mapData, data.stripsData, 1);
    expect(loadedPanels.length).toBe(3);
    expect(loadedPanels[0].source).toBe(data.stripsData[0].panels[0].source);
    expect(loadedPanels[1].source).toBe(data.stripsData[0].panels[1].source);
    expect(loadedPanels[2].source).toBe(data.stripsData[0].panels[2].source);
  });
  
  // ..    
  // ||||||
  it("returns the appropriate 2 panels when the buffer size is 1 and the loaded panel is the first one", function() {
    var component = getComponentWithData({strips: data.stripsData, stripNumber: 1});
    var loadedPanels = component.getPanelsToLoad(0, data.mapData, data.stripsData, 1);
    expect(loadedPanels.length).toBe(2);
    expect(loadedPanels[0].source).toBe(data.stripsData[0].panels[0].source);
    expect(loadedPanels[1].source).toBe(data.stripsData[0].panels[1].source);
  });

  //     ..
  // ||||||
  it("returns the appropriate 2 panels when the buffer size is 1 and the loaded panel is the last one", function() {
    var component = getComponentWithData({strips: data.stripsData, stripNumber: 1});
    var loadedPanels = component.getPanelsToLoad(5, data.mapData, data.stripsData, 1);
    expect(loadedPanels.length).toBe(2);
    expect(loadedPanels[0].source).toBe(data.stripsData[1].panels[1].source);
    expect(loadedPanels[1].source).toBe(data.stripsData[1].panels[2].source);
  });

  //    .
  // ||||||
  it("returns just the specified panel when the buffer size is 0", function() {
    var component = getComponentWithData({strips: data.stripsData, stripNumber: 1});
    var loadedPanels = component.getPanelsToLoad(3, data.mapData, data.stripsData, 0);
    expect(loadedPanels.length).toBe(1);
    expect(loadedPanels[0].source).toBe(data.stripsData[1].panels[0].source);
  });

  //  .
  // ||||||
  it("doesn't return panels which have already been loaded", function() {
    var component = getComponentWithData({strips: data.stripsData, stripNumber: 1});
    var panelIndexToLoad = 1;
    data.mapData.forEach(function(panel, index) {
      if (index != panelIndexToLoad) {
        panel.hasBeenLoaded = true;
      }
    });
    var loadedPanels = component.getPanelsToLoad(1, data.mapData, data.stripsData, 1);
    expect(loadedPanels.length).toBe(1);
    expect(loadedPanels[0].source).toBe(data.stripsData[0].panels[panelIndexToLoad].source);
  });
});

describe("comic.addPanelsToCollection()", function() {
  var data = null;

  beforeEach(function() {
    data = dataFactory.createData();
  });

  it("adds a single panel to the collection", function() {
    const component = getComponentWithData({strips: data.stripsData, stripNumber: 1});
    const panelToAdd = data.stripsData[0].panels[0];
    const panelsToAdd = [panelToAdd];
    const panelsMap = data.mapData;
    const panelsParentObject = { panels: [] };
    component.addPanelsToCollection(panelsToAdd,
                                    panelsParentObject,
                                    panelsMap);

    expect(panelsParentObject.panels.length).toBe(1);
    expect(panelsParentObject.panels[0].source).toBe(panelToAdd.source);
  });

  it("adds a multiple panels to the collection", function() {
    const component = getComponentWithData({strips: data.stripsData, stripNumber: 1});
    const panelToAdd1 = data.stripsData[0].panels[0];
    const panelToAdd2 = data.stripsData[0].panels[1];
    const panelsToAdd = [panelToAdd1, panelToAdd2];
    const panelsMap = data.mapData;
    const panelsParentObject = { panels: [] };
    component.addPanelsToCollection(panelsToAdd,
                                    panelsParentObject,
                                    panelsMap);

    expect(panelsParentObject.panels.length).toBe(2);
    expect(panelsParentObject.panels[0].source).toBe(panelToAdd1.source);
    expect(panelsParentObject.panels[1].source).toBe(panelToAdd2.source);
  });

  // V
  //  |
  it("sorts panels correctly when panels before the existing panel are added", function() {
    const component = getComponentWithData({strips: data.stripsData, stripNumber: 1});
    const existingPanel = data.stripsData[0].panels[1];
    const panelToAdd = data.stripsData[0].panels[0];
    const panelsToAdd = [panelToAdd];
    const panelsMap = data.mapData;
    const panelsParentObject = { panels: [] };
    panelsParentObject.panels.push(existingPanel);
    component.addPanelsToCollection(panelsToAdd,
                                    panelsParentObject,
                                    panelsMap);

    expect(panelsParentObject.panels.length).toBe(2);
    expect(panelsParentObject.panels[0].source).toBe(panelToAdd.source);
    expect(panelsParentObject.panels[1].source).toBe(existingPanel.source);
  });

  //  V
  // |
  it("sorts panels correctly when panels after the existing panel are added", function() {
    const component = getComponentWithData({strips: data.stripsData, stripNumber: 1});
    const existingPanel = data.stripsData[0].panels[0];
    const panelToAdd = data.stripsData[0].panels[1];
    const panelsToAdd = [panelToAdd];
    const panelsMap = data.mapData;
    const panelsParentObject = { panels: [existingPanel] };
    component.addPanelsToCollection(panelsToAdd,
                                    panelsParentObject,
                                    panelsMap);

    expect(panelsParentObject.panels.length).toBe(2);
    expect(panelsParentObject.panels[0].source).toBe(existingPanel.source);
    expect(panelsParentObject.panels[1].source).toBe(panelToAdd.source);
  });

  //  V
  // | |
  it("sorts panels correctly when panels are added in between the existing panels", function() {
    const component = getComponentWithData({strips: data.stripsData, stripNumber: 1});
    const existingPanel1 = data.stripsData[0].panels[0];
    const existingPanel2 = data.stripsData[0].panels[2];
    const panelToAdd = data.stripsData[0].panels[1];
    const panelsToAdd = [panelToAdd];
    const panelsMap = data.mapData;
    const panelsParentObject = { panels: [existingPanel1, existingPanel2] };
    component.addPanelsToCollection(panelsToAdd,
                                    panelsParentObject,
                                    panelsMap);

    expect(panelsParentObject.panels.length).toBe(3);
    expect(panelsParentObject.panels[0].source).toBe(existingPanel1.source);
    expect(panelsParentObject.panels[1].source).toBe(panelToAdd.source);
    expect(panelsParentObject.panels[2].source).toBe(existingPanel2.source);
  });

  it("updates the hasBeenLoaded property to true when panels are added", function() {
    const component = getComponentWithData({strips: data.stripsData, stripNumber: 1});
    const panelToAdd1 = data.stripsData[0].panels[0];
    const panelToAdd2 = data.stripsData[0].panels[1];
    const panelsToAdd = [panelToAdd1, panelToAdd2];
    const panelsMap = data.mapData;
    const panelsParentObject = { panels: [] };
    component.addPanelsToCollection(panelsToAdd,
                                    panelsParentObject,
                                    panelsMap);

    expect(panelsMap[0].hasBeenLoaded).toBe(true);
    expect(panelsMap[1].hasBeenLoaded).toBe(true);
  });
});