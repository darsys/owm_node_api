const axios = require('axios')
const config = require('config')

const owmApiConfig = {
  url: process.env.OWM_URL,
  apiKey: process.env.OWM_API_KEY,
  mystation: {
    station_id: config.get('openweathermap.station.id'),
    external_id: config.get('openweathermap.station.publicid'),
    name: config.get('openweathermap.station.name'),
    latitude: config.get('openweathermap.station.latitude'),
    longitude: config.get('openweathermap.station.longitude'),
    altitude: config.get('openweathermap.station.longitude')
  }
}
console.log('OpenWeatherMap API Station Info:', JSON.stringify(owmApiConfig.mystation, undefined, 2))

function updateStationData (conditions) {
  // conditions.station_id = '5e275c9c6c634e00011e046b'
  conditions.dt = unixDT()
  conditions.station_id = owmApiConfig.mystation.station_id
  var cA = [conditions]
  console.debug(`Update OWM with this json: ${JSON.stringify(cA, undefined, 2)}`)
  axios({
    method: 'post',
    url: owmApiConfig.url + '/measurements',
    headers: {
      'Content-Type': 'application/json'
    },
    params: {
      APPID: owmApiConfig.apiKey
    },
    data: cA
  })
    .then(function (response) {
      console.debug(`response status code:, ${response.status} text: ${response.statusText}`)
      // console.debug('response status code:  ${response.statusText})
      // console.debug('response data:', response.data)
    })
    .catch(function (error) {
      console.error(error)
    })
    .finally(function () {
      // always executed
    })
}

// function registerStation (station = owmApiConfig.mystation) {
//   axios({
//     method: 'post',
//     url: owmApiConfig.url + '/stations',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     params: {
//       APPID: owmApiConfig.apikey
//     },
//     data: station
//   })
//     .then(function (response) {
//       console.debug('response status code:', response.status)
//       console.debug('response status code:', response.statusText)
//       console.debug('response data:', response.data)
//     })
//     .catch(function (error) {
//       console.error(error)
//     })
// }

function unixDT () {
  return Math.round(new Date().getTime() / 1000)
}

module.exports = { updateStationData }