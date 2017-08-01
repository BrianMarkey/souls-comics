<template>
  <center>
    <h1>SOULS COMICS</h1>
    <div id="app">
      <div class="panels-container" v-bind:style="{ width: panelWidth + 'px'}">
        <transition-group tag="ul"
                          v-bind:name="transitionDirection + '-panel'"
                          v-bind:style="{ width : (panelWidth * 2) + 'px' }"
                          v-on:before-leave="setTransition(true)"
                          v-on:after-leave="setTransition(false)">
          <li v-for="panel in panels" v-show="panel.isCurrentPanel" v-bind:key="panel.key">
            <div class="currentListItem">
              <panel v-bind:panel="panel"></panel>
            </div>
          </li>
        </transition-group>
      </div>
      <div class="controls" v-bind:class="transitionInProgress ? 'disabled' : ''">
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
        currentGlobalPanelIndex: 0,
        panels: [],
        panelWidth: 720,
        panelBufferSize: 1,
        panelsMap: [],
        stripsUrlNameMap: { },
        transitionDirection: 'next',
        transitionInProgress: false
      };
    },
    beforeMount: function () {
      const maps = this.panelsService.createMaps(this.strips);
      this.panelsMap = maps.panelsMap;
      this.stripsUrlNameMap = maps.urlNamesMap;
      this.loadFromRouteValues();
    },
    methods: {
      setTransition: function (inProgress) {
        this.transitionInProgress = inProgress;
      },
      loadFromRouteValues: function() {
        const stripMap = this.stripsUrlNameMap[this.stripUrlName] || {
          startPanelGlobalIndex: 0,
          stripIndex : 0
        };
        const strip = this.strips[stripMap.stripIndex];
        const panelIndex = this.panelsService.getPanelIndexFromPanelNumber(strip, this.panelNumber);
        const nextGlobalPanelIndex = stripMap.startPanelGlobalIndex + panelIndex;
        this.setCurrentPanel(nextGlobalPanelIndex, stripMap.stripIndex, panelIndex);
      },
      setCurrentPanel: function (nextGlobalPanelIndex, stripIndex, panelIndex) {
        var panelsToLoad = this.panelsService.getPanelsToLoad(this.panelsMap,
                                                              nextGlobalPanelIndex,
                                                              this.strips,
                                                              this.panelBufferSize);

        this.transitionDirection = nextGlobalPanelIndex >= this.currentGlobalPanelIndex ?
          'next' : 'previous';

        this.panels = panelsToLoad;
        this.currentStripIndex = stripIndex;
        this.currentPanelIndexInStrip = panelIndex;
        this.currentGlobalPanelIndex = nextGlobalPanelIndex;
      },
      playCurrentVideo: function () {

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
      currentPanelIsFirst: function () {
        return this.panelsService.panelIsFirst(this.currentStripIndex, this.currentPanelIndexInStrip);
      },
      currentPanelIsLast: function () {
        return this.panelsService.panelIsLast(this.currentStripIndex,
                                              this.currentPanelIndexInStrip,
                                              this.strips);
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
  .disabled a {
    pointer-events: none;
  }
  .panels-container {
    overflow: hidden;
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

  .next-panel-leave-active {
    transition: margin-left 1s, opacity 1s;
  }
  .next-panel-leave-to  {
    margin-left: -720px;
  }
  .previous-panel-enter-active {
    margin-left: -720px;
    transition: margin-left 1s;
  }
  .previous-panel-enter-to {
    margin-left: 0px;
  }
  .previous-panel-leave-active {
    transition: opacity 1s;
  }
</style>