import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './registerServiceWorker'

import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import '@fortawesome/fontawesome-free/css/all.css'

Vue.use(Vuetify)

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
  vuetify: new Vuetify(),
}).$mount('#app')
