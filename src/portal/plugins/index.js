import modal from './modal'
import messagebox from './messagebox/messagebox'
import loadingbox from './loading/loading'
import Vue from 'vue'
import VueTouch  from 'vue-touch'
import hlocalStory from '@/plugins/dialogCarousel/localStorage'

Vue.use(messagebox);
Vue.use(loadingbox);
Vue.use(VueTouch, {name: 'v-touch'});

export default {
  install(Vue) {
    Vue.prototype.$modal = modal
    Vue.prototype.hstore = hlocalStory;
  }
}
