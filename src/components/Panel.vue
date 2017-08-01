
<template>
  <video v-if="panel"
        playsinline="true"
        webkit-playsinline=""
        poster=""
        class="panel-video"
        ref="vids"
        v-bind:key="panel.index">
        <source v-bind:src="panel.source" v-bind:data-i="panel.index" type="video/webm">
  </video>
</template>


<script>
  export default {
    name: 'panel',
    index: 'index',
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


<style lang="less">
  .panel-video {
    width: 100%;
    max-width: 720px;
  }
</style>