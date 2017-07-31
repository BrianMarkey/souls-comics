import panelsService from 'src/services/panels-service.js'

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
    const result = panelsService.getPanelIndexFromPanelNumber(strips[0], -1);
    expect(result).toBe(0);
  });
  
  it("returns 0 for an integer outside of the bounds of the panels", function() {
    const result = panelsService.getPanelIndexFromPanelNumber(strips[0], 20);
    expect(result).toBe(0);
  });
  
  it("returns 1 for a value of 2", function() {
    const result = panelsService.getPanelIndexFromPanelNumber(strips[0], 2);
    expect(result).toBe(0);
  });
});