/* eslint-disable no-unused-vars */
import Vue from 'vue'
import App from './App.vue'
const fs = require('fs');
const reader = require('./reader.js')

// watch for file changes every 1s
reader.readFile();
fs.watchFile(reader.getLogFile(), { interval: 1000 }, () => {
  reader.readFile()
});

Vue.config.productionTip = false

import Buefy from 'buefy'
import 'buefy/dist/buefy.css'

Vue.use(Buefy)

new Vue({
  render: h => h(App),
}).$mount('#app')

