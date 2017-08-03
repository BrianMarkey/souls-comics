<template>
  <div>
    <video v-if="panel.type === 'video'"
          playsinline="true"
          webkit-playsinline=""
          poster=""
          class="panel-video"
          ref="vids"
          v-bind:key="panel.key">
          <source v-bind:src="panel.source" v-bind:data-i="panel.key" type="video/webm">
    </video>
    <img v-if="panel.type === 'image'" v-bind:src="panel.source" />
  </div>
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
    }
  }
</script>

<style lang="less">
  .panel-video {
    width: 100%;
    max-width: 720px;
  }
</style>
