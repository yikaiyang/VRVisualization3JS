<template>
  <div id="app">
    <div class="ui">
      <Menubar></Menubar>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Menubar from './components/Menubar.vue'

export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  components: {
    Menubar,
  }
}
</script>

<style lang="scss">
@import '../node_modules/bootstrap/scss/bootstrap.scss';

#app {
  font-family: 'Segoe UI', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.ui {
  position: absolute;
}

body{
  background-color: #000914;
}

</style>
