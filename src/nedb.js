const {app} = require('electron');
const Datastore = require('nedb-promises');
const dbFactory = (fileName) => Datastore.create({
  filename: `${process.env.NODE_ENV === 'development' ? '.' : app.getAppPath('userData')}/data/${fileName}`, 
  timestampData: true,
  autoload: true
});
const logs = dbFactory('logs.db')
const config = dbFactory('config.db')
// logs.remove({})

const nedb = {
  logs: logs,
  config: config,
  writeLog: async (obj) => {      
    const x = await logs.update(obj, obj, {upsert:true})
    return x
  },
  getLog: async (searchParams) => {
    const x = await logs.find(searchParams).sort( { "date": -1 } )
    return {x}
  },
  writeConfig: async (obj) => {      
    const x = await config.update(obj, obj, {upsert:true})
    return x
  },
  getConfig: async (searchParams) => {
    const x = await config.find(searchParams)
    return {x}
  }
};
module.exports = nedb;