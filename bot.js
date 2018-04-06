require('./connect');
const CONFIG = require('./config.json');
const SCRAPER = require('./Modules/scraper');
const CLEANER = require('./Modules/mapCleaner');
const NOTIFY = require('./Modules/emailNotification');
const REQUESTMODEL = require('./Modules/RequestModel');


(async () => {

    let map = new Map()
    map.set('bot', [])

    try {
        let requests = await REQUESTMODEL.find()

        requests.forEach( (request, counter = 0) => {

            let obj = {
                keyword: request.keyword,
                url: request.url,
                email: request.email,
                index: map.get('bot').length,
                mentioned: new Map()
            }
            map.set(counter, obj)
            map.get('bot').push(SCRAPER(map, counter))

        })


        while(true) {
            let newMapArray = await Promise.all(map.get('bot'))
            newMapArray.map(elem => map.set(elem.index, elem))
            map = await CLEANER(map)
        }


    } catch (err) {
        console.error(err);
        await NOTIFY.error(err, CONFIG.logEmail)
    }


})()

