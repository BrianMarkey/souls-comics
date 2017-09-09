import Vue from 'vue';
import VueRouter from 'vue-router';
import VueAnalytics from 'vue-analytics';
import Comic from 'src/components/Comic.vue';
import Panel from 'src/components/Panel.vue';
import data from 'static/strip-data.json';
import panelsService from 'src/services/panels-service.js';

require.context('static/', true);

Vue.use(VueRouter);
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
    props: () => (getPropsData())
  }
];

const router = new VueRouter({
  routes,
  mode: 'history'
});

Vue.use(VueAnalytics, {
  id: 'UA-106163013-1',
  router,
  autoTracking: {
    pageviewTemplate (route) {
      return {
        page: route.path,
        title: document.title,
        location: window.location.href
      };
    },
    debug: {
      enabled: true,
      trace: true,
      sendHitTask: true
    }
  }
});

new Vue({
  el: '#app',
  router
});
