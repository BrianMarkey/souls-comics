import Vue from 'vue'
import Comic from 'src/Comic.vue'

describe("comic-component", function() {
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

  it("has a currentStripIndex property defined in the data object", function() {
    var data = Comic.data();
    expect(data.currentStripIndex).toBeDefined();
  });
});