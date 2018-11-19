import Vue from 'vue'
import App from './App.vue'
import router from './router'
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

Vue.prototype.$server = `https://blog-server.ndiw.online`

// Vue.prototype.$server = axios.create({
//   baseUrl: 'http://localhost:3000'
// })
