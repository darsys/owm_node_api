const wdt = require('./weatherdatatools/weatherdatatools')

class owmConditions {
  temperature = new wdt.condition()
  humidity = new wdt.humidity()
  wind_speed = new wdt.wind_speed('m/s', 300)
  wind_gust = new wdt.wind_dir()
  pressure = new wdt.pressure()
  rain = 0 // mm in last hour
}

// owm json data example
// const OWMconditions = {
//   "station_id": "583436dd9643a9000196b8d6",
//   "dt": 1479817340,
//   "temperature": 18.7,
//   "wind_speed": 1.2,
//   "wind_gust": 3.4,
//   "pressure": 1021,
//   "humidity": 87,
//   "rain_1h": 2,
//   "clouds": [
//     {
//         "condition": "NSC"
//     }
//   ]
// }

module.exports = owmConditions