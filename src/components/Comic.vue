<template>
  <center>
    <h1>SOULS COMICS</h1>
    <div id="app">
      <div class="panels-container">
          <ul ref="panels" v-bind:style="{ marginLeft: panelsLeftOffset + 'px', width: panels.length * panelWidth + 'px'}">
            <li v-for="panel in panels">
              <div class="currentListItem">
                <panel v-bind:panel="panel"></panel>
              </div>
            </li>
          </ul>
      </div>
      <div class="controls">
        <router-link v-bind:to="previousPanelPath"
                     v-bind:style="{ visibility: currentPanelIsFirst ? 'hidden' : 'inherit' }">Previous</router-link>
        <a v-on:click="playCurrentVideo()">Play</a>
        <router-link v-bind:to="nextPanelPath"
                     v-bind:style="{ visibility: currentPanelIsLast ? 'hidden' : 'inherit' }">Next</router-link>
      </div>
      <a v-on:click="requestFullScreen"><h1>REQUEST FULL SCREEN</h1></a>
    </div>
  </center>
</template>

<script>
  export default {
    name: 'comic',
    props: [
      'strips',
      'stripUrlName',
      'panelNumber',
      'panelsService'
    ],
    data: function () {
      return {
        // The index of the current list item in the
        // current area's list of items.
        currentStripIndex: 0,
        currentPanelIndexInStrip: 0,
        panels: [],
        panelWidth: 720,
        panelBufferSize: 1,
        panelsMap: [],
        stripsUrlNameMap: { }
      };
    },
    beforeMount: function () {
      const maps = this.panelsService.createMaps(this.strips);
      this.panelsMap = maps.panelsMap;
      this.stripsUrlNameMap = maps.urlNamesMap;
      this.loadFromRouteValues();
    },
    methods: {
      loadFromRouteValues: function() {
        const stripIndex = this.stripsUrlNameMap[this.stripUrlName] || 0;
        const strip = this.strips[stripIndex];
        const panelIndex = this.panelsService.getPanelIndexFromPanelNumber(strip, this.panelNumber);
        this.setCurrentPanel(strip, stripIndex, panelIndex);
      },
      setCurrentPanel: function (strip, stripIndex, panelIndex) {
        var panelsToLoad = this.panelsService.getPanelsToLoad(panelIndex,
                                                              stripIndex,
                                                              this.panelsMap,
                                                              strip,
                                                              this.strips,
                                                              this.panelBufferSize);
        this.panels = panelsToLoad;
        this.currentStripIndex = stripIndex;
        this.currentPanelIndexInStrip = panelIndex;
      },
      playCurrentVideo: function () {
        this.$refs.vids[this.currentPanelIndexInQueue].play();
      },
      requestFullScreen: function () {
        var firstVid = document.querySelector('video');
        console.log(firstVid.requestFullscreen);
        console.log(firstVid.msRequestFullscreen);
        console.log(firstVid.mozRequestFullScreen);
        console.log(firstVid.webkitRequestFullscreen);
        firstVid.webkitRequestFullscreen();
      }
    },
    computed: {
      panelsLeftOffset: function () {
        return -this.panelWidth * this.panelBufferSize * this.currentPanelIndexInQueue;
      },
      currentPanelIsFirst: function () {
        return this.panelsService.panelIsFirst(this.currentStripIndex, this.currentPanelIndexInStrip);
      },
      currentPanelIsLast: function () {
        var strip = this.strips[this.currentStripIndex];

        return this.panelsService.panelIsLast(this.currentStripIndex,
                                              this.currentPanelIndexInStrip,
                                              this.strips);
      },
      currentPanelIndexInQueue: function() {
        if (this.currentPanelIsFirst) {
          return 0;
        }
        if (this.currentPanelIsLast) {
          return this.panelBufferSize * 2;
        }
        return this.panelBufferSize;
      },
      nextPanelPath: function () {
        if (this.currentPanelIsLast) {
          return '';
        }
        var currentStrip = this.strips[this.currentStripIndex];
        if (this.currentPanelIndexInStrip === currentStrip.panels.length - 1) {
          return '/' + this.strips[this.currentStripIndex + 1].urlName + '/panels/1'
        }
        return '/' + currentStrip.urlName + '/panels/' + (this.currentPanelIndexInStrip + 2);
      },
      previousPanelPath: function () {
        if (this.currentPanelIsFirst) {
          return '';
        }
        var currentStrip = this.strips[this.currentStripIndex];
        if (this.currentPanelIndexInStrip === 0) {
          const previousStrip = this.strips[this.currentStripIndex - 1];
          return '/' + previousStrip.urlName + '/panels/' + previousStrip.panels.length;
        }
        return '/' + currentStrip.urlName + '/panels/' + (this.currentPanelIndexInStrip);
      }
    },
    watch: {
    '$route.params': function (params) {
      this.loadFromRouteValues();
    }
  },
  };
</script>

<style lang="less">
  a {
    cursor: pointer;
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