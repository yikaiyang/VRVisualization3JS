import Vue from 'vue'
import App from './App.vue'
import Menubar from './components/Menubar'
import router from './router'

import './3d/earthviewer/earth-viewer-launcher.js' //Load earth

require('jquery/dist/jquery');
require('popper.js/dist/umd/popper');
require('bootstrap/dist/js/bootstrap');
require('d3-fetch');

//import './3d/earthviewer/earth-viewer-launcher.js'


new Vue({
  el: '#app',
  router,
  components: { App, Menubar },
  template: '<App/>'
})
