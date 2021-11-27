require('dotenv').config()
const axios = require('axios')

const owmApiConfig = {
  url: process.env.OWM_URL,
  apiKey: process.env.OWM_API_KEY,
  mystation: {
    external_id: process.env.OWM_STATION_PUBLICID,
    name: process.env.OWM_STATION_NAME,
    latitude: process.env.OWM_STATION_LATITUDE,
    longitude: process.env.OWM_STATION_LONGITUDE,
    altitude: process.env.OWM_STATION_ALTITUDE
  }
}
console.log('OpenWeatherMap API Config:', JSON.stringify(owmApiConfig, undefined, 2))

function updateStationData (conditions) {
  conditions.station_id = '5e275c9c6c634e00011e046b'
  conditions.dt = unixDT()
  var cA = [conditions]
  // console.debug(`Update OWM with this json:`)
  // console.debug(JSON.stringify(cA, undefined, 2))
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