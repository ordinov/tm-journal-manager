const fs = require('fs');
require('log-timestamp');
const readLastLines = require('read-last-lines');
const nedb = require('./nedb.js')

const path = '/Applications/The Miracle.app/Contents/Resources/TheMiracle/Data/Client/JournalLogs/';

const reader = {
   getLogFile : () => {
      var logfiles = fs.readdirSync(path).filter(fn => fn.endsWith('journal.txt')).sort();
      return path + logfiles[logfiles.length-1]
   },
   readFile : () => {
      // read last 50 lines
      readLastLines.read (reader.getLogFile(), 50)
         .then((block) => {
            // split blocks in lines
            let lines = block.match(/[^\r\n]+/g)
            // loop lines
            lines.forEach(line => {
               // parse date and instanciate a Date object (ex. [01/01/2020 12:18])
               let datestring = line.substr(1, 16)
               let dateArray = /(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})/.exec(datestring); 
               let date = dateArray[3] + '-' + dateArray[1] + '-' + dateArray[2] + ' ' + dateArray[4] + ':' + dateArray[5] + ':00'
               // remove date from line then..
               line = line.substr(18).trim()
               // .. get the owner of the line (ex. System, or Tizio Caio)
               let who = line.substr(0, line.indexOf(':'))
               // remove who
               let message = line.split(who).join('').trim().substr(2)
               // write log in local db
               nedb.writeLog({ date:date, who:who, message:message, deleted:false })
            })
         }
      );
   }
};
module.exports = reader;



