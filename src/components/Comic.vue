<template>
    <div id="app">
      <h1>SOULS COMICS</h1>
      <div class="twitter-container"
          v-bind:class="twitterHasLoaded ? 'loaded' : ''">
        <a href="https://twitter.com/soulscomics" 
          class="twitter-follow-button"
          data-show-count="false"
          data-show-screen-name="false">Follow</a>
      </div>
      <div class="outer-panels-container">
        <div class="panels-container" v-bind:style="{ width: panelWidth + 'px'}">
          <transition-group tag="ul"
                            v-bind:name="transitionDirection + '-panel'"
                            v-bind:style="{ width : (panelWidth * 2) + 'px' }"
                            v-on:before-leave="onBeforeLeavePanel"
                            v-on:after-leave="onAfterLeavePanel">
            <li v-for="panel in panels" v-show="panel.isCurrentPanel" v-bind:key="panel.key">
              <div class="currentListItem">
                <video preload="auto"
                      playsinline
                      webkit-playsinline
                      v-bind:poster="panel.type === 'video' ? '' : panel.source"
                      class="panel-video"
                      ref="vid"
                      v-bind:class="panel.isCurrentPanel ? 'active' : ''"
                      v-on:play="onVideoPlay"
                      v-on:playend="onVideoPlayEnd"
                      v-on:pause="onVideoPlayEnd">

                      <source v-if="panel.type === 'video'" 
                              v-bind:src="panel.source"
                              type="video/mp4">
                      <source v-if="panel.type === 'intro'"
                              src=""
                              type="video/mp4">
                </video>
              </div>
            </li>
          </transition-group>
          <div class="controls" v-bind:class="transitionInProgress || videoIsPlaying ? 'disabled' : ''">
            <router-link v-bind:to="previousPanelPath"
                        v-bind:style="{ visibility: currentPanelIsFirst ? 'hidden' : 'inherit' }">
              <span>Prev</span>
            </router-link>
            <div class="buttons">
              <button v-bind:class="controlButtonMode"
                      v-on:click="onControlButtonClick"></button>
            </div>
            <router-link v-bind:to="nextPanelPath"
                        v-bind:style="{ visibility: currentPanelIsLast ? 'hidden' : 'inherit' }">
              <span>Next</span>
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
        transitionInProgress: false,
        // The current video is currently playing.
        videoIsPlaying: false,
        // Indicates that the twitter widgets are ready to show.
        twitterHasLoaded: false
      };
    },
    // Implementation of the Vue.js beforeMount hook.
    beforeMount() {
      const maps = this.panelsService.createMaps(this.strips);
      this.panelsMap = maps.panelsMap;
      this.stripsUrlNameMap = maps.urlNamesMap;
      this.loadFromRouteValues();
    },
    mounted() {
      // Once the twitter library has loaded, show set the twitterHasLoaded
      // to show the follow button.
      // The twttr object might not be there if
      // the user has tracking protection enabled.
      if (typeof(twttr) !== 'undefined') {
        twttr.events.bind(
          'loaded',
          (event) => {
            this.twitterHasLoaded = true;
          });
      }
    },
    methods: {
      onControlButtonClick() {
        if(this.controlButtonMode === 'pause') {
          this.pauseVideo();
        }
        if(this.controlButtonMode === 'play') {
          this.playCurrentVideo();
        }
      },
      onVideoPlay() {
        this.videoIsPlaying = true;
      },
      onVideoPlayEnd() {
        this.videoIsPlaying = false;
      },
      onVideoPaused() {
        this.videoIsPlaying = false;
      },
      // Handle the before leave event of a panel transition.
      onBeforeLeavePanel() {
        this.transitionInProgress = true;
      },
      // Handle the after leave event of a panel transition.
      onAfterLeavePanel() {
        this.transitionInProgress = false;
        if (this.currentPanelIsPlayable) {
          this.playCurrentVideo();
        }
      },
      // Take the route parameters and load the appropriate panels.
      // Default to the first panel overall if no route values are present.
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
      // Set the currently viewed panel.
      // nextGlobalPanelIndex: The global index of the panel to set as current.
      // stripIndex: The index of the of the strip containing the panel to set as current.
      // panelIndex: The index of the panel in its parent strip.
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
      // Start playing the video for the current panel.
      playCurrentVideo() {
        var currentVideo = this.$el.querySelector('.panels-container .active');
        if (currentVideo) {
          currentVideo.play();
        }
      },
      // Start playing the video for the current panel.
      pauseVideo() {
        var currentVideo = this.$el.querySelector('.panels-container .active');
        if (currentVideo) {
          currentVideo.pause();
        }
      },
      // NOT COMPLETE. Make the video for the current panel
      // full screen if the device supports it.
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
      controlButtonMode() {
        if (this.videoIsPlaying) {
          return 'pause';
        }
        if (this.currentPanelIsPlayable) {
          return 'play';
        }
        return 'none';
      },
      // todo move this to service
      currentPanelIsPlayable() {
        const currentPanel = this.strips[this.currentStripIndex].panels[this.currentPanelIndexInStrip];

        return currentPanel.type === 'video';
      },
      // Is the current panel the first overall?
      currentPanelIsFirst() {
        return this.panelsService.panelIsFirst(this.currentStripIndex, this.currentPanelIndexInStrip);
      },
      // Is the current panel the last overall?
      currentPanelIsLast() {
        return this.panelsService.panelIsLast(this.currentStripIndex,
                                              this.currentPanelIndexInStrip,
                                              this.strips);
      },
      // The url to the next panel if there is one.
      nextPanelPath() {
        return this.panelsService.getNextPanelPath(this.currentPanelIsLast,
                                                   this.currentStripIndex,
                                                   this.currentPanelIndexInStrip,
                                                   this.strips);
      },
      // The url to the previous panel if there is one.
      previousPanelPath() {
        return this.panelsService.getPreviousPanelPath(this.currentPanelIsFirst,
                                                       this.currentStripIndex,
                                                       this.currentPanelIndexInStrip,
                                                       this.strips);
      },
    },
    // Reload the state when the route values change.
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
  a {
    font-family: "dks";
    font-size: 2em;
    cursor: pointer;
    &:visited, &:link {
      color: #c7c7c7;
    }
    &:hover, &active {
      color: #8c625f;
    }
  }
  button {
    width: 50px;
    height: 62px;
    background: url('~static/video-controls.png') no-repeat;
    background-size: 150px 124px;
    background-color: transparent;
    border: none;
    margin: 0px 30px;
    cursor: pointer;
    &.play {
      background-position: 0px 0px;
      &:hover {
        background-position-y: -62px;
      }
    }
    &.pause {
      background-position: -50px 0px;
      &:hover {
        background-position-y: -62px;
      }
    }
    &.none {
      visibility: hidden;
    }
  }
  .controls {
    display: flex;
    justify-content: space-around;
    a {
        margin: auto;
        font-size: 48px;
        width: 25%;
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
    border-top: 47px solid;
    border-bottom: 47px solid;
    border-left: 64px solid;
    border-right: 64px solid;
    border-image: url(~static/bg-border.png) 47 64 47 64 repeat;
    display: inline-block;
  }
  .panels-container {
    border: 4px solid #352c2d;
    overflow: hidden;
    background-image: url(~static/panel-bg-texture.png);
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
    margin: 0px;
  }
  .twitter-container {
    margin-left: 750px;
    margin-top: -24px;
    height: 24px;
    opacity: 0;
    &.loaded {
      transition: opacity 1s;
      opacity: 1;
    }
  }
  ::-webkit-media-controls {
    /*display:none !important;*/
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
