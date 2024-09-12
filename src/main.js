import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import store from './store'
import vuetify from './plugins/vuetify'
import { mixs } from '@/mixins';
import 'vue-toastification/dist/index.css';
import Toast from 'vue-toastification';


Vue.config.productionTip = false

// set axios as global var
window.DB = axios

// mixin for alerts
Vue.mixin(mixs)

// alerts
Vue.use(Toast, {
  transition: 'Vue-Toastification__bounce',
  maxToasts: 20,
  newestOnTop: true
})




// window.URI = 'http://127.0.0.1:3001/api/v1'
window.URI = 'https://quiet-leandra-elpostre-a2b95fa0.koyeb.app/api/v1'

new Vue({
  router,
  store,
  vuetify,
  render: function (h) { return h(App) }
}).$mount('#app')
