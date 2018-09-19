<template>
  <div id="app">
    <Menubar></Menubar>
    <div class="ui">
      
      <Search ></Search>
      <router-view ></router-view>
    </div>
  </div>
</template>

<script>

import Menubar from './components/Menubar.vue'
import Search from './components/Search.vue'

export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  components: {
    Menubar,
    Search
  }
}
</script>

<style lang="scss">
@import '../node_modules/bootstrap/scss/bootstrap.scss';

#app {
  font-family: 'Heebo', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  width: 100%;

  //Make text not selectable
  user-select: none;
}

.ui {
  position: absolute;
  z-index: 100;
}

body{
  //background-color: #000914;

  background-color: #000914;
}

</style>
