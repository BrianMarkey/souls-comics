import Vue from 'vue'
import VueRouter from 'vue-router'
import Comic from './Comic.vue'
Vue.use(VueRouter)

const routes = [
  { path: '/', component: Comic },
  { path: '/:id', component: Comic }
]

const router = new VueRouter({
  routes
});

const app = new Vue({
  el: '#app',
  router
})
