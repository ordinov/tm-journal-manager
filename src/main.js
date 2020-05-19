/* eslint-disable no-unused-vars */
import Vue from 'vue'
import App from './App.vue'
const nedb = require('./nedb.js')

const fs = require('fs');
require('log-timestamp');
const readLastLines = require('read-last-lines');

Vue.config.productionTip = false

import Buefy from 'buefy'
import 'buefy/dist/buefy.css'

Vue.use(Buefy)

new Vue({
  render: h => h(App),
}).$mount('#app')


const path = '/Applications/The Miracle.app/Contents/Resources/TheMiracle/Data/Client/JournalLogs/';

var logfiles = fs.readdirSync(path).filter(fn => fn.endsWith('journal.txt')).sort();
var logfile = path + logfiles[logfiles.length-1]
setInterval(() => {
  logfiles = fs.readdirSync(path).filter(fn => fn.endsWith('journal.txt')).sort();
  logfile = path + logfiles[logfiles.length-1]
}, 5000 ) // 5s

// watch for file changes every 1s
fs.watchFile(logfile, { interval: 1000 }, () => {
  // read last 50 lines
  readLastLines.read(logfile, 50)
    .then((block) => {
      // split blocks in lines
      let lines = block.match(/[^\r\n]+/g)
      // loop lines
      lines.forEach(line => {
        // parse date and instanciate a Date object (ex. [01/01/2020 12:18])
        let datestring = line.substr(1, 16)
        let dateArray = /(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})/.exec(datestring); 
        let date = dateArray[3] + '-' + dateArray[1] + '-' + dateArray[2] + ' ' + dateArray[4] + ':' + dateArray[5] + ':' + dateArray[6] );
        // remove date from line then..
        line = line.substr(18).trim()
        // .. get the owner of the line (ex. System, or Tizio Caio)
        let who = line.substr(0, line.indexOf(':'))
        // remove who
        let message = line.split(who).join('').trim().substr(2)
        // write log in local db
        nedb.writeLog({ date:date, who:who, message:message })
      })
    }
  );
});