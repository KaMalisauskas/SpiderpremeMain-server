require('./connect');
const CONFIG = require('./config.json');
const SCRAPER = require('./Modules/scraper');
const CLEANER = require('./Modules/mapCleaner');
const NOTIFY = require('./Modules/emailNotification');
const BotSetup = require('./Modules/BotRecreation');


(async () => {

    try {
        let map = await BotSetup()
        console.log(map)
        while(true) {
            let newMapArray = await Promise.all(map.get('bot'));
            newMapArray.map(elem => map.set(elem.email, elem));
            map = await CLEANER(map);
            map = await BotSetup(map);
        }


    } catch (err) {
        console.error(err);
        await NOTIFY.error(err, CONFIG.logEmail)
    }


})()

