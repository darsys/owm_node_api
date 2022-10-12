const debug = require('debug')('client')
const wdt = require('./weatherdatatools')
const EventEmitter = require("events")

const owmCoditionsSupported = [
  'temperature',
  'wind_speed',
  'wind_gust',
  'pressure',
  'humidity',
  'rain_1h'
]

class Client extends EventEmitter  {
  temperature = 0
  wind = new wdt.wind()
  rain = new wdt.rain()
  constructor(owcs = owmCoditionsSupported) {
    super()
    debug(`creating new client..`)
    if (owcs.contains('temperature')) this.temperature = 0
    if (owcs.contains('rain_1h')) this.rain = new wdt.rain()
    if (owcs.contains('wind_speed') || owcs.contains('wind_gust')) this.wind = new wdt.wind()
  }

  addWindObservation = () => {

  }
}
  
module.exports = Client