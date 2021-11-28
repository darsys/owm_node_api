require('dotenv').config()
const config = require('config')
const owm = require('./openweathermap')
const mqttClient = require('./clients/mqtt')

// console.debug(`mqtt Host: ${config.get('mqtt.host')}`)

const mqttConfig = {
  host: config.get('mqtt.host'),
  options: {
    // username: process.env.MQTT_USERNAME,
    // password: process.env.MQTT_PASSWORD,
    clientId: config.get('mqtt.host'),
    keepalive: config.get('mqtt.options.keepalive'),
    reconnectPeriod: config.get('mqtt.options.reconnectPeriod'),
    clean: config.get('mqtt.options.clean')
  }
}
// console.log('MQTT Config:', JSON.stringify(mqttConfig, undefined, 2))

const conditionTopics = {
  temperature: config.get('mqtt.conditiontopics.temperature'),
  humidity: config.get('mqtt.conditiontopics.humidity'),
  wind_speed: config.get('mqtt.conditiontopics.wind_speed'),
  wind_dir: config.get('mqtt.conditiontopics.wind_dir'),
  rain_1h: config.get('mqtt.conditiontopics.rain_1h'),
}

var currentConditions = {}

console.log(`mqtt create client and connect to : ${mqttConfig}`)
var client = new mqttClient(mqttConfig, conditionTopics )

client.on("update", (conditions) => {
  // console.debug(`mqtt update fired:`)
  console.debug(conditions)
})

function updateOWMConditions() {
  owm.updateStationData(currentConditions)
}

setInterval(updateOWMConditions, 60000)