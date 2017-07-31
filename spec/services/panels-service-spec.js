import panelsService from 'src/services/panels-service.js'

describe("panels-service.panelIsLast()", function() {
  var strips = [
    {
      "name": "Test strip one.",
      "urlName": "test-strip-one",
      "panels": [
        {
          "type": "video",
          "source": "https://giant.gfycat.com/FlimsySpottedAmericancrocodile.webm"
        },
        {
          "type": "video",
          "source": "https://zippy.gfycat.com/CavernousNiceChamois.webm"
        }
      ]
    },
    {
      "name": "Test strip two.",
      "urlName": "test-strip-two",
      "panels": [
        {
          "type": "video",
          "source": "https://giant.gfycat.com/PopularPaltryAidi.webm"
        },
        {
          "type": "video",
          "source": "https://giant.gfycat.com/PopularPaltryAidi2.webm"
        }
      ]
    }
  ];

  it("returns true if the panel is the last in the panels array of the last strip", function() {
    const lastStripIndex = strips.length - 1;
    const lastPanelIndex = strips[lastStripIndex].panels.length - 1;
    const result = panelsService.panelIsLast(lastStripIndex, lastPanelIndex, strips);
    expect(result).toBe(true);
  });

  it("returns false if the panel does not belong to the last strip", function() {
    const secondTolastStripIndex = strips.length - 2;
    const result = panelsService.panelIsLast(secondTolastStripIndex, 0, strips);
    expect(result).toBe(false);
  });

  it("returns false if the panel belongs to the last strip, but is not the last panel", function() {
    const lastStripIndex = strips.length - 1;
    const result = panelsService.panelIsLast(lastStripIndex, 0, strips);
    expect(result).toBe(false);
  });

  it("returns false if there are no strips", function() {
    const result = panelsService.panelIsLast(0, 0, []);
    expect(result).toBe(false);
  });

  it("returns false if the strip index is not numeric", function() {
    const lastStripIndex = strips.length - 1;
    const lastPanelIndex = strips[lastStripIndex].panels.length - 1;
    const result = panelsService.panelIsLast('sdf', lastPanelIndex, []);
    expect(result).toBe(false);
  });

  it("returns false if the panel index is not numeric", function() {
    const lastStripIndex = strips.length - 1;
    const lastPanelIndex = strips[lastStripIndex].panels.length - 1;
    const result = panelsService.panelIsLast(lastStripIndex, 'ffe', []);
    expect(result).toBe(false);
  });
});

describe("panels-service.panelIsFirst()", function() {
  it("returns true if the strip index is 0 and the panel index is 0", function() {
    const result = panelsService.panelIsFirst(0, 0);
    expect(result).toBe(true);
  });

  it("returns false if the strip index is not 0 and the panel index is 0", function() {
    const result = panelsService.panelIsFirst(1, 0);
    expect(result).toBe(false);
  });

  it("returns false if the strip index is not 0 and the panel index is not 0", function() {
    const result = panelsService.panelIsFirst(1, 1);
    expect(result).toBe(false);
  });

  it("returns false if the strip index is 0 and the panel index is not 0", function() {
    const result = panelsService.panelIsFirst(0, 1);
    expect(result).toBe(false);
  });

  it("returns false if the strip index is not an integer and the panel index is 0", function() {
    const result = panelsService.panelIsFirst('hi', 1);
    expect(result).toBe(false);
  });

  it("returns false if the strip index is 0 and the panel index is not an integer", function() {
    const result = panelsService.panelIsFirst(0, 'hi');
    expect(result).toBe(false);
  });
});

describe("panels-service.getPanelIndexFromPanelNumber()", function() {
  var strips = [
    {
      "name": "Test strip one.",
      "urlName": "test-strip-one",
      "panels": [
        {
          "type": "video",
          "source": "https://giant.gfycat.com/FlimsySpottedAmericancrocodile.webm"
        },
        {
          "type": "video",
          "source": "https://zippy.gfycat.com/CavernousNiceChamois.webm"
        }
      ]
    },
    {
      "name": "Test strip two.",
      "urlName": "test-strip-two",
      "panels": [
        {
          "type": "video",
          "source": "https://giant.gfycat.com/PopularPaltryAidi.webm"
        }
      ]
    }
  ];

  it("returns 0 for a alpha string", function() {
    const result = panelsService.getPanelIndexFromPanelNumber(strips[0], 'dff');
    expect(result).toBe(0);
  });

  it("returns 0 for a decimal string", function() {
    const result = panelsService.getPanelIndexFromPanelNumber(strips[0], '4.5');
    expect(result).toBe(0);
  });
  
  it("returns 0 for negative integer", function() {
    const result = panelsService.getPanelIndexFromPanelNumber(strips[0], '-1');
    expect(result).toBe(0);
  });
  
  it("returns 0 for an integer outside of the bounds of the panels", function() {
    const result = panelsService.getPanelIndexFromPanelNumber(strips[0], '20');
    expect(result).toBe(0);
  });
  
  it("returns 1 for a string value of '2'", function() {
    const result = panelsService.getPanelIndexFromPanelNumber(strips[0], '2');
    expect(result).toBe(1);
  });
  
  it("returns 1 for a integer value of 2", function() {
    const result = panelsService.getPanelIndexFromPanelNumber(strips[0], 2);
    expect(result).toBe(1);
  });
});

describe("panels-service.createMaps()", function() {
  var strips = [
    {
      "name": "Test strip one.",
      "urlName": "test-strip-one",
      "panels": [
        {
          "type": "video",
          "source": "https://giant.gfycat.com/FlimsySpottedAmericancrocodile.webm"
        },
        {
          "type": "video",
          "source": "https://zippy.gfycat.com/CavernousNiceChamois.webm"
        }
      ]
    },
    {
      "name": "Test strip two.",
      "urlName": "test-strip-two",
      "panels": [
        {
          "type": "video",
          "source": "https://giant.gfycat.com/PopularPaltryAidi.webm"
        }
      ]
    }
  ];
  
  it("returns an object with an object property called 'urlNamesMap'", function() {
    const result = panelsService.createMaps(strips);
    expect(typeof result.urlNamesMap).toBe('object');
  });
  
  it("returns an object with an array property called 'panelsMap'", function() {
    const result = panelsService.createMaps(strips);
    expect(Array.isArray(result.panelsMap)).toBe(true);
  });
  
  it("returns an object with a 'panelsMap' property with a length of 3 when there are three total panels in all of the strips", function() {
    const result = panelsService.createMaps(strips);
    expect(result.panelsMap.length).toBe(3);
  });
  
  it("returns an object with a 'urlNamesMap' property with a map of the url names to their indexes in the strips array", function() {
    const result = panelsService.createMaps(strips);
    strips.forEach(function(strip, i) {
      expect(result.urlNamesMap[strip.urlName]).toEqual(i);
    });
  });
  
  it("returns an empty array for the 'panelsMap' property when there are no strips", function() {
    const result = panelsService.createMaps([]);
    expect(Array.isArray(result.panelsMap)).toBe(true);
    expect(result.panelsMap.length).toBe(0);
  });
  
  it("returns an empty array for the 'urlNamesMap' property when there are no strips", function() {
    const result = panelsService.createMaps([]);
    expect(Object.keys(result.urlNamesMap).length).toBe(0);
  });
});