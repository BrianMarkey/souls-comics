import Vue from 'vue';
import VueRouter from 'vue-router';
import Comic from 'src/components/Comic.vue';
import Panel from 'src/components/Panel.vue';
import data from 'static/strip-data.json';
import panelsService from 'src/services/panels-service.js'

require.context("static/", true);

const VueTouch = require('vue-touch');
const services = { panelsService };

Vue.use(VueRouter);
Vue.use(VueTouch, { name: 'v-touch' });
Vue.component('panel', Panel);

const routes = [
  {
    path: '/:stripUrlName',
    component: Comic,
    props: (route) => ({
                        strips: data.strips,
                        stripUrlName: route.params.stripUrlName,
                        panelNumber: 1,
                        panelsService: panelsService
                      })
  },
  {
    path: '/:stripUrlName/panels/:panelNumber',
    component: Comic,
    props: (route) => ({
                        strips: data.strips,
                        stripUrlName: route.params.stripUrlName,
                        panelNumber: route.params.panelNumber,
                        panelsService: panelsService
                      })
  },
  {
    path: '/',
    component: Comic,
    props: (route) => ({
                        strips: data.strips,
                        stripUrlName: data.strips[0].urlName,
                        panelNumber: 1,
                        panelsService: panelsService
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
