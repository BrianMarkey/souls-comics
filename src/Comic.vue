<template>
  <center>
    <h1>SOULS COMICS</h1>
    <div id="app">
      <div class="panels-container">
          <ul ref="panels" v-bind:style="{ marginLeft: panelsLeftOffset + 'px', width: panels.length * panelWidth + 'px'}">
            <li v-for="panel in panels">
              <div class="currentListItem">
                <video v-if="panels"
                      playsinline="true"
                      webkit-playsinline=""
                      poster=""
                      class="panel-video"
                      ref="vids">
                      <source id="webmSource" v-bind:src="panel.source" type="video/webm">
                </video>
              </div>
            </li>
          </ul>
      </div>
      <div class="controls">
        <a v-bind:style="{ visibility: currentPanelIsFirst ? 'hidden' : 'inherit' }"
           v-on:click="previousPanel()">Previous</a>
        <a v-on:click="playCurrentVideo()">Play</a>
        <a v-bind:style="{ visibility: currentPanelIsLast ? 'hidden' : 'inherit' }"
           v-on:click="nextPanel()" >Next</a>
      </div>
      <a v-on:click="requestFullScreen"><h1>REQUEST FULL SCREEN</h1></a>
    </div>
  </center>
</template>

<script>
  export default {
    name: 'comic',
    props: ['strips', 'stripNumber'],
    data: function () {
      return {
        // The index of the current list item in the
        // current area's list of items.
        currentStripIndex: 0,
        currentPanelIndex: 0,
        currentItemIndex: 0,
        panels: [],
        panelWidth: 720,
        panelBufferSize: 1,
        panelsMap: []
      };
    },
    beforeMount: function () {
      this.panelsMap = this.createPanelsMap();

      this.setCurrentStrip(this.stripIndex);
    },
    methods: {
      setCurrentStrip: function (stripIndex) {
        var startStrip = this.strips[stripIndex];

        var panelsToLoad = this.getPanelsToLoad(startStrip.startPanelIndex,
                                                this.panelsMap,
                                                this.strips,
                                                this.panelBufferSize);

        this.addPanelsToCollection(panelsToLoad,
                                   this,
                                   this.panelsMap);
      },
      /// Get the panels which should be loaded
      /// for a panel of a given index, including
      /// the panel with the matching index, and
      /// the buffering panelsnpmnop
      /// todo: possibly add parameter validation.
      getPanelsToLoad: function (panelIndex,
                                 panelsMap,
                                 stripsData,
                                 bufferSize) {
        var panelsToLoad = [];
        const panelsToLoadStartIndex = Math.max(0, panelIndex - bufferSize);
        const panelsToLoadEndIndex = Math.min(panelsMap.length - 1, panelIndex + bufferSize);

        for (var i = panelsToLoadStartIndex; i <= panelsToLoadEndIndex; i++) {
          var panelMap = panelsMap[i];
          if (!panelMap.hasBeenLoaded) {
            // Get the actual panel from the strip
            // and panel indexes in the panel map object
            const panelToLoad = stripsData[panelMap.stripIndex].panels[panelMap.panelIndex];
            panelsToLoad.push(panelToLoad);
          }
        }

        return panelsToLoad;
      },
      /// Add the given panels to the global
      /// collection of panels, which will update the DOM
      /// We pass in the parent object of the panels
      /// array to make it more testable. The component
      /// will pass the instance of itself when it uses this method.
      addPanelsToCollection: function (panelsToAdd,
                                       panelsParentObject,
                                       panelsMap) {
        // Concat the panels to add to create a new array
        var newPanels = panelsParentObject.panels.concat(panelsToAdd);
        // Sort the new array by the global panel index
        newPanels.sort(function (a, b) {
          if (a.panelSort < b.panelSort) {
            return -1;
          }
          if (a.panelSort > b.panelSort) {
            return 1;
          }
          return 0;
        });
        // Overwrite the array of loaded panels with the
        // new, sorted array.
        panelsParentObject.panels = newPanels;
        // Update the panels map to mark the newly
        // loaded panels as loaded.
        panelsToAdd.forEach(function (panelToUpdate) {
          panelsMap[panelToUpdate.panelSort].hasBeenLoaded = true;
        });
      },
      /// Create an array which maps panels to their strip
      createPanelsMap: function () {
        var result = [];
        var panelLoopIndex = 0;
        for (var i = 0; i < this.strips.length; i++) {
          var strip = this.strips[i];
          strip.startPanelIndex = panelLoopIndex;
          for (var j = 0; j < strip.panels.length; j++) {
            result.push({stripIndex: i, panelIndex: j});
            strip.panels[j].panelSort = panelLoopIndex;
            panelLoopIndex++;
          }
        }
        return result;
      },
      playCurrentVideo: function () {
        this.$refs.vids[this.currentItemIndex].play();
      },
      nextPanel: function () {
        // Should we load another panel?
        var anotherPanelIsNeedeed = this.currentItemIndex === this.panels.length - 1 - this.panelBufferSize;
        if (anotherPanelIsNeedeed) {
          var nextPanel = this.getPanel();
          if (nextPanel != null) {
            this.panels.push(nextPanel);
          }
          this.panels.push(panelToLoad);
        }
        if (!this.currentPanelIsLast) {
          this.currentItemIndex++;
        }
        this.$nextTick(function () {
          this.playCurrentVideo();
        });
      },
      /// Get the panel based on the zero-based strip index
      /// and zero-based panel index provided
      /// Returns 'null' if no panel is found for the given indexes 
      getPanel: function (stripIndex, panelIndex) {
        if (typeof stripIndex === 'undefined' ||
            typeof panelIndex === 'undefined' ) {
          return null;
        }
        var strip = this.strips[stripIndex];
        if (!strip || !strip.panels) {
          return null;
        }
        var panel = strip.panels[panelIndex];
        if (!panel) {
          return null;
        }
        return panel;
      },
      previousPanel: function () {
        if (!this.currentPanelIsFirst) {
          this.currentItemIndex--;
        }
        this.$nextTick(function () {
          this.playCurrentVideo();
        });
      },
      requestFullScreen: function () {
        var firstVid = document.querySelector('video');
        console.log(firstVid.requestFullscreen);
        console.log(firstVid.msRequestFullscreen);
        console.log(firstVid.mozRequestFullScreen);
        console.log(firstVid.webkitRequestFullscreen);
        firstVid.webkitRequestFullscreen();
      },
      isInt: function(value) {
        if (isNaN(value)) {
          return false;
        }
        var x = parseFloat(value);
        return (x | 0) === x;
      }
    },
    computed: {
      panelsLeftOffset: function () {
        return this.panelWidth * this.currentItemIndex * -1;
      },
      currentPanelIsFirst: function () {
        return this.currentItemIndex === 0;
      },
      currentPanelIsLast: function () {
        return this.currentItemIndex === this.panels.length - 1;
      },
      stripIndex: function () {
        if (!this.isInt(this.stripNumber)) {
          return 0;
        }
        return this.stripNumber - 1;
      }
    }
  };
</script>

<style lang="less">
  a {
    cursor: pointer;
  }
  .panel-video {
    width: 100%;
    max-width: 720px;
  }
  .panels-container {
    overflow: hidden;
    width: 720px;
    display: inline-block;
  }
  .slider-control {
    display: inline-block;
  }
  ul {
    padding: 0px;
    margin: 0px;
    text-align: left;
    li {
      list-style: none;
      display: inline-block;
    }
  }
  body {
    background: ##f2efcf;
    background-image: url("bg1.png"), url("bg2.png");
    background-repeat: repeat-x, repeat;
  }
  h1 {
    font-size: 80px;
    color: #686666;
    text-shadow: 3px 3px #000000;
    font-family: "dks";
  }
  ::-webkit-media-controls {
    display:none !important;
  }
  @font-face {
    font-family: "dks";
    src: url(OptimusPrincepsSemiBold.ttf) format("truetype");
  }
</style>