import Vue from 'vue'
import VueRouter from 'vue-router'
// import App from './App.vue'
import Comic from './Comic.vue'
Vue.use(VueRouter)

const routes = [
  { path: '/', component: Comic }
]

const router = new VueRouter({
  routes
});

new Vue({
  el: '#app',
  render: h => h(Comic),
  router
})
