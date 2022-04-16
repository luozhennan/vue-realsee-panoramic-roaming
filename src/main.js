import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
import store from '@/store'

// https://github.com/superhos/vue-baberrage/blob/master/docs/zh/README.md
import { vueBaberrage } from 'vue-baberrage'

import Message from '@/components/Message/Index'
import Dialog from '@/components/Dialog/Index'
Vue.use(vueBaberrage)
Vue.component(Dialog.name, Dialog)

Vue.use(Message)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
