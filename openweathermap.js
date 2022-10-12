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
console.log('OpenWeatherMap API Info:', JSON.stringify(owmApiConfig, undefined, 2))

function updateStationData (conditions) {
  // console.debug(conditions)
  // conditions.station_id = '5e275c9c6c634e00011e046b'
  conditions.dt = unixDT()
  conditions.station_id = owmApiConfig.mystation.station_id
  var cA = [conditions]
  console.debug(`Update OWM at ${owmApiConfig.url} with this json: ${JSON.stringify(cA, undefined, 2)}`)
  axios({
    method: 'post',
    url: owmApiConfig.url + '/measurements',
    headers: {
      'Content-Type': 'application/json'
    },
    params: {
      appid: owmApiConfig.apiKey
    },
    data: cA
  })
    .then(function (response) {
      console.debug(`response status code:, ${response.status} text: ${response.statusText}`)
      // console.debug('response status code:  ${response.statusText})
      // console.debug('response data:', response.data)
    })
    .catch(function (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
      console.error(error.config);
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