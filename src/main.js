import Vue from 'vue';
import VueRouter from 'vue-router';
import Comic from './Comic.vue';

require.context("../static/", true);

var VueTouch = require('vue-touch');

Vue.use(VueRouter);
Vue.use(VueTouch, { name: 'v-touch' });

const routes = [
  { path: '/', component: Comic },
  { path: '/:id', component: Comic }
]

const router = new VueRouter({
  routes,
  mode: 'history'
});

const app = new Vue({
  el: '#app',
  router
})
