<template>
    <div id="app">
      <h1>SOULS COMICS</h1>
      <div class="outer-panels-container">
        <div class="panels-container" v-bind:style="{ width: panelWidth + 'px'}">
          <transition-group tag="ul"
                            v-bind:name="transitionDirection + '-panel'"
                            v-bind:style="{ width : (panelWidth * 2) + 'px' }"
                            v-on:before-leave="setTransition(true)"
                            v-on:after-leave="setTransition(false)">
            <li v-for="panel in panels" v-show="panel.isCurrentPanel" v-bind:key="panel.key">
              <div class="currentListItem">
                <video v-if="panel.type === 'video'"
                      playsinline="true"
                      webkit-playsinline=""
                      poster=""
                      class="panel-video"
                      ref="vid"
                      v-bind:key="panel.key"
                      v-bind:class="panel.isCurrentPanel ? 'active' : ''">
                      <source v-bind:src="panel.source" type="video/webm">
                </video>
                <img v-if="panel.type === 'image'" v-bind:src="panel.source" />
              </div>
            </li>
          </transition-group>
          <div class="controls" v-bind:class="transitionInProgress ? 'disabled' : ''">
            <router-link v-bind:to="previousPanelPath"
                        v-bind:style="{ visibility: currentPanelIsFirst ? 'hidden' : 'inherit' }">
              <span>Previous</span>
              <img src="./sword.png"/>
            </router-link>
            <a v-on:click="playCurrentVideo()">Play</a>
            <router-link v-bind:to="nextPanelPath"
                        v-bind:style="{ visibility: currentPanelIsLast ? 'hidden' : 'inherit' }">
              <span>Next</span>
              <img class="flipped" src="./sword.png"/>
            </router-link>
          </div>
        </div>
      </div>
    </div>
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
      setCurrentPanel: function (nextGlobalPanelIndex,
                                 stripIndex,
                                 panelIndex) {
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
        var currentVideo = this.$el.querySelector('.panels-container .active');
        if (currentVideo) {
          currentVideo.play();
        }
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
        return this.panelsService.getNextPanelPath(this.currentPanelIsLast,
                                                   this.currentStripIndex,
                                                   this.currentPanelIndexInStrip,
                                                   this.strips);
      },
      previousPanelPath: function () {
        return this.panelsService.getPreviousPanelPath(this.currentPanelIsFirst,
                                                       this.currentStripIndex,
                                                       this.currentPanelIndexInStrip,
                                                       this.strips);
      },
    },
    watch: {
    '$route.params': function (params) {
      this.loadFromRouteValues();
    }
  },
  };
</script>

<style lang="less">
  #app {
    text-align: center;
  }
  .flipped {
    -moz-transform: scaleX(-1);
    -o-transform: scaleX(-1);
    -webkit-transform: scaleX(-1);
    transform: scaleX(-1);
    filter: FlipH;
    -ms-filter: "FlipH";
  }
  a {
    font-family: "dks";
    font-size: 2em;
    cursor: pointer;
    &:visited {
      color: #c7c7c7;
    }
  }

  .controls {
    display: flex;
    justify-content: space-around;
    a {
      span {
        display: block;
      }
    }
  }
  .panel-video {
    width: 100%;
    max-width: 720px;
  }

  .disabled a {
    pointer-events: none;
  }
  .outer-panels-container{
    background-image: url("panel-bg-texture.png");
    border: 47px solid;
    display: inline-block;
    border-image: url(bg-border.png) 47 47 47 47 repeat;
  }
  .panels-container {
    border: 4px solid #4f3c3e;
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
    background: ##a1716d;
    background-image: url("cherrybg-1.png"), url("cherrybg-2.png");
    background-repeat: repeat-x, repeat;
    color: #c7c7c7;
  }
  h1 {
    font-size: 80px;
    text-shadow: 3px 3px #7d634b;
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
    transition: margin-left .5s, opacity .5s;
  }
  .next-panel-leave-to  {
    margin-left: -720px;
  }
  .previous-panel-enter-active {
    margin-left: -720px;
    transition: margin-left .5s;
  }
  .previous-panel-enter-to {
    margin-left: 0px;
  }
  .previous-panel-leave-active {
    transition: opacity .5s;
  }
</style>
