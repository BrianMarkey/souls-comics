import Vue from 'vue';
import VueRouter from 'vue-router';
import Comic from './Comic.vue';
import data from 'static/strip-data.json';

require.context("static/", true);

const VueTouch = require('vue-touch');

Vue.use(VueRouter);
Vue.use(VueTouch, { name: 'v-touch' });

const routes = [
  {
    path: '/:stripNumber',
    component: Comic,
    props: (route) => ({
                        strips: data.strips,
                        stripNumber: route.params.stripNumber
                      })
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
});

const app = new Vue({
  el: '#app',
  router
})
