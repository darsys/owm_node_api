const wdt = require('./weatherdatatools/weatherdatatools')

class owmCondition {
  temperature = new wdt.condition_tracker('C',3600)
  humidity = new wdt.humidity('%',3600)
  wind_speed = 0.0 // m/s
  wind_gust = 0.0 // m/s
  pressure = 0 // Hectopascal
  rain_1h = 0 // mm in last hour
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

module.exports = owmCondition