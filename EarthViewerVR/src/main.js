import Vue from 'vue'
import App from './App.vue'
import Menubar from './components/Menubar'
import router from './router'

new Vue({
  el: '#app',
  router,
  components: { App, Menubar },
  template: '<App/>'
})
