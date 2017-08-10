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
              <img src="~static/sword.png"/>
            </router-link>
            <a v-on:click="playCurrentVideo()">Play</a>
            <router-link v-bind:to="nextPanelPath"
                        v-bind:style="{ visibility: currentPanelIsLast ? 'hidden' : 'inherit' }">
              <span>Next</span>
              <img class="flipped" src="~static/sword.png"/>
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
      // The data about the comic strips.
      'strips',
      // The name of the referenced strip from the url.
      'stripUrlName',
      // The 1-based number of the panel in the strip from the url.
      'panelNumber',
      // The service containg logic related to navigating
      // panels.
      'panelsService'
    ],
    data() {
      return {
        // The 0-based index of the current comic strip.
        currentStripIndex: 0,
        // The 0-based index of the current panel within the
        // currnent commic strip.
        currentPanelIndexInStrip: 0,
        // The 0-based index of the current panel in the list
        // of all available panels in all available comic strips.
        currentGlobalPanelIndex: 0,
        // An array containing the currently loaded panels.
        panels: [],
        // The global panel width. All panels must be at least this
        // wide in order for the slider to work properly.
        panelWidth: 720,
        // The number of panels to load before and after the current
        // panel as a buffer to prevent delays in navigaion.
        panelBufferSize: 1,
        // An index of all of the panels in all of the
        // comic strips.
        panelsMap: [],
        // An object containing all of the comic strips with the url name
        // as the property key and and the strip index, and global index
        // of the first panel as the object associated with the url name.
        // {
        //    urlName: 'name',
        //    stripIndex: 0,
        //    startPanelGlobalIndex: 0
        //  }
        stripsUrlNameMap: { },
        // The directon in which the slideshow is moving.
        // Possible values 'next', 'previous.
        transitionDirection: 'next',
        // Indicates if a transition between panels is currently
        // in progress.
        transitionInProgress: false
      };
    },
    beforeMount() {
      const maps = this.panelsService.createMaps(this.strips);
      this.panelsMap = maps.panelsMap;
      this.stripsUrlNameMap = maps.urlNamesMap;
      this.loadFromRouteValues();
    },
    methods: {
      setTransition(inProgress) {
        this.transitionInProgress = inProgress;
        if (inProgress === false) {
          this.playCurrentVideo();
        }
      },
      loadFromRouteValues() {
        const stripMap = this.stripsUrlNameMap[this.stripUrlName] || {
          startPanelGlobalIndex: 0,
          stripIndex : 0
        };
        const strip = this.strips[stripMap.stripIndex];
        const panelIndex = this.panelsService.getPanelIndexFromPanelNumber(strip, this.panelNumber);
        const nextGlobalPanelIndex = stripMap.startPanelGlobalIndex + panelIndex;
        this.setCurrentPanel(nextGlobalPanelIndex, stripMap.stripIndex, panelIndex);
      },
      setCurrentPanel(nextGlobalPanelIndex,
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
      playCurrentVideo() {
        var currentVideo = this.$el.querySelector('.panels-container .active');
        if (currentVideo) {
          currentVideo.play();
        }
      },
      requestFullScreen() {
        var firstVid = document.querySelector('video');
        console.log(firstVid.requestFullscreen);
        console.log(firstVid.msRequestFullscreen);
        console.log(firstVid.mozRequestFullScreen);
        console.log(firstVid.webkitRequestFullscreen);
        firstVid.webkitRequestFullscreen();
      }
    },
    computed: {
      currentPanelIsFirst() {
        return this.panelsService.panelIsFirst(this.currentStripIndex, this.currentPanelIndexInStrip);
      },
      currentPanelIsLast() {
        return this.panelsService.panelIsLast(this.currentStripIndex,
                                              this.currentPanelIndexInStrip,
                                              this.strips);
      },
      nextPanelPath() {
        return this.panelsService.getNextPanelPath(this.currentPanelIsLast,
                                                   this.currentStripIndex,
                                                   this.currentPanelIndexInStrip,
                                                   this.strips);
      },
      previousPanelPath() {
        return this.panelsService.getPreviousPanelPath(this.currentPanelIsFirst,
                                                       this.currentStripIndex,
                                                       this.currentPanelIndexInStrip,
                                                       this.strips);
      },
    },
    watch: {
      '$route.params'(params) {
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
    max-width: 720px;
  }

  .disabled a {
    pointer-events: none;
  }
  .outer-panels-container {
    background-image: url("~static/panel-bg-texture.png");
    border: 47px solid;
    border-image: url(~static/bg-border.png) 47 47 47 47 repeat;
    display: inline-block;
  }
  .panels-container {
    border: 4px solid #4f3c3e;
    overflow: hidden;
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
    background: #a1716d;
    background-image: url("~static/cherrybg-1.png"), 
                      url("~static/cherrybg-2.png");
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
    src: url(~static/OptimusPrincepsSemiBold.ttf) format("truetype");
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
