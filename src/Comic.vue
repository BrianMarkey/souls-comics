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
                      <source id="webmSource" v-bind:src="panel" type="video/webm">
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
    {{ stripIndex }}
  </center>
</template>


<script>
  export default {
    name: 'comic',
    props: ['strips', 'stripIndex'],
    data: function () {
      return {
        // The index of the current list item in the
        // current area's list of items.
        currentStripIndex: 0,
        currentPanelIndex: 0,
        currentItemIndex: 0,
        allPanels: [
          'https://giant.gfycat.com/FlimsySpottedAmericancrocodile.webm',
          'https://zippy.gfycat.com/CavernousNiceChamois.webm',
          'https://giant.gfycat.com/PopularPaltryAidi.webm'
        ],
        panels: [],
        panelWidth: 720,
        panelBufferSize: 1
      };
    },
    beforeMount: function () {
      // Load panels up to the buffer size.
      this.panels = this.allPanels.slice(0, this.panelBufferSize + 1);
    },
    mounted: function () {

    },
    methods: {
      playCurrentVideo: function () {
        this.$refs.vids[this.currentItemIndex].play();
      },
      nextPanel: function () {
        // Should we load another panel?
        var anotherPanelIsNeedeed = this.currentItemIndex === this.panels.length - 1 - this.panelBufferSize;
        var thereArePanelsToLoad = this.panels.length < this.allPanels.length;
        if (anotherPanelIsNeedeed &&
            thereArePanelsToLoad) {
          var panelToLoad = this.allPanels.slice(this.panels.length, this.panels.length + 1)[0];
          this.panels.push(panelToLoad);
        }
        if (!this.currentPanelIsLast) {
          this.currentItemIndex++;
        }
        this.$nextTick(function () {
          this.playCurrentVideo();
        });
      },
      getPanel: function (stripIndex, panelIndex) {
        var strip = strips[stripIndex];
        if (!strip) {
          return null;
        }
        var panel = strip[panelIndex];
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