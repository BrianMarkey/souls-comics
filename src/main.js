import Vue from 'vue';
import VueRouter from 'vue-router';
import Comic from 'src/components/Comic.vue';
import Panel from 'src/components/Panel.vue';
import data from 'static/strip-data.json';
import panelsService from 'src/services/panels-service.js'

require.context("static/", true);

const VueTouch = require('vue-touch');

Vue.use(VueRouter);
Vue.use(VueTouch, { name: 'v-touch' });
Vue.component('panel', Panel);

function getPropsData(stripUrlName, panelNumber) {

  return {
    strips: data.strips,
    stripUrlName: stripUrlName || data.strips[0].urlName,
    panelNumber: panelNumber || 1,
    panelsService: panelsService
  };
}

const routes = [
  {
    path: '/:stripUrlName',
    component: Comic,
    props: (route) => (getPropsData(route.params.stripUrlName))
  },
  {
    path: '/:stripUrlName/panels/:panelNumber',
    component: Comic,
    props: (route) => (getPropsData(route.params.stripUrlName, route.params.panelNumber))
  },
  {
    path: '/',
    component: Comic,
    props: (route) => (getPropsData())
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
