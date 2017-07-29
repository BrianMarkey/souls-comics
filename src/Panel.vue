
<template>
  <video v-if="panel"
        playsinline="true"
        webkit-playsinline=""
        poster=""
        class="panel-video"
        ref="vids">
        <source id="webmSource" v-bind:src="panel.source" type="video/webm">
  </video>
</template>


<script>
  export default {
    name: 'panel',
    props: ['panel'],
    data: function () {
      return {
      }
    },
    beforeMount: function () {
      console.log(this.panel);
    }
  }
</script>