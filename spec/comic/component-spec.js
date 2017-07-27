import Vue from 'vue'
import Comic from 'src/Comic.vue'

function getComponentWithData (propsData) {
  const constructor = Vue.extend(Comic);
  return new constructor({ propsData: propsData }).$mount();
}

const data = 
{
  "strips": [
    {
      "name": "Test strip one.",
      "panels": [
        {
          "type": "video",
          "source": "https://giant.gfycat.com/FlimsySpottedAmericancrocodile.webm"
        },
        {
          "type": "video",
          "source": "https://zippy.gfycat.com/CavernousNiceChamois.webm"
        },
        {
          "type": "video",
          "source": "https://giant.gfycat.com/PopularPaltryAidi.webm"
        }
      ]
    }
  ]
};

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

  it("has has a playCurrentVideo method", function() {
    var component = getComponentWithData(data);
    expect(typeof component.playCurrentVideo).toBe('function');
  });
});


describe("comic.getPanel()", function() {
  it("returns the correct panel", function() {
    var component = getComponentWithData(data);
    var source = component.getPanel(0,0).source;
    expect(source).toBe("https://giant.gfycat.com/FlimsySpottedAmericancrocodile.webm");
  });
  
  it("returns null if the strip doesn't exist", function() {
    var component = getComponentWithData(data);
    var panel = component.getPanel(data.strips.length, 0);
    expect(panel).toBe(null);
  });
  
  it("returns null if the panel doesn't exist", function() {
    var stripIndex = 0;
    var nonExistentPanelIndex = data.strips[stripIndex].panels.length;
    var component = getComponentWithData(data);
    var panel = component.getPanel(stripIndex, nonExistentPanelIndex);
    expect(panel).toBe(null);
  });
  
  it("returns null if only one parameter is passed", function() {
    var component = getComponentWithData(data);
    var panel = component.getPanel(0);
    expect(panel).toBe(null);
  });
  
  it("returns null if no parameters are passed", function() {
    var component = getComponentWithData(data);
    var panel = component.getPanel();
    expect(panel).toBe(null);
  });
});