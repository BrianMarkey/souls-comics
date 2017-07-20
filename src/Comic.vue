<template>
  <center>
    <div id="app">
      <a v-bind:style="{ visibility: currentPanelIsFirst ? 'hidden' : 'inherit' }"
        class="slider-control"
        v-on:click="previousPanel()"><img src="./previous-arrow.png" /></a>
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
      <a v-bind:style="{ visibility: currentPanelIsLast ? 'hidden' : 'inherit' }"
        class="slider-control"
        v-on:click="nextPanel()"><img src="./next-arrow.png" /></a>
      <div>
        <a v-on:click="playCurrentVideo()">PLAY</a>
      </div>
    </div>
    {{ this.$route.path }}
  </center>
</template>


<script>
  export default {
    name: 'comic',
    data: function () {
      return {
        // The index of the current list item in the
        // current area's list of items.
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
      },
      previousPanel: function () {
        if (!this.currentPanelIsFirst) {
          this.currentItemIndex--;
        }
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
        console.log(this.panels.length);
        return this.currentItemIndex === this.panels.length - 1;
      }
    }
  };
</script>

<style>
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
  }
  li {
    list-style: none;
    display: inline-block;
  }
  body {
    background-color: #545556;
  }
</style>