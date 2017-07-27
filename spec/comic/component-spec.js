import Vue from 'vue'
import Comic from 'src/Comic.vue'

function getComponentWithData (propsData) {
  const constructor = Vue.extend(Comic);
  return new constructor({ propsData: propsData }).$mount();
}

describe("comic-component", function() {

  const data = 
  {
    "strips": [
      {
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

  it("exists", function() {
    expect(Comic).toBeDefined();
  });

  it("has a beforeMount function", function() {
    expect(typeof Comic.beforeMount).toBe('function');
  });

  it("has a data function", function() {
    expect(typeof Comic.data).toBe('function');
  });

  it("has can execute the data function", function() {
    var data = Comic.data();
    expect(data).toBeDefined();
  });

  it("has has a playCurrentVideo method", function() {
    var component = getComponentWithData(data);
    expect(typeof component.playCurrentVideo).toBe('function');
  });

  it("strips", function() {
    var component = getComponentWithData(data);
    var source = component.strips[0].panels[0].source;
    expect(source).toBe("https://giant.gfycat.com/FlimsySpottedAmericancrocodile.webm");
  });

  it("has a currentStripIndex property defined in the data object", function() {
    var data = Comic.data();
    expect(data.currentStripIndex).toBeDefined();
  });
});