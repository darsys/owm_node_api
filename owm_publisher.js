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
    clientId: config.get('mqtt.options.clientId'),
    keepalive: config.get('mqtt.options.keepalive'),
    reconnectPeriod: config.get('mqtt.options.reconnectPeriod'),
    clean: config.get('mqtt.options.clean')
  }
}
// console.log('MQTT Config:', JSON.stringify(mqttConfig, undefined, 2))

const conditionTopics = {
  temperature: process.env.TOPIC_TEMPERATURE,
  humidity: process.env.TOPIC_HUMIDITY,
  wind_speed: process.env.TOPIC_WIND_SPEED,
  wind_dir: process.env.TOPIC_WIND_DIR,
  rain_1h: process.env.TOPIC_RAIN_1H
}

var currentConditions = {}
console.debug(process.env.DEBUG)
console.log('mqtt create client and connect')
console.error('error')

var client = new mqttClient(mqttConfig, conditionTopics )

client.on("update", (conditions) => {
  console.debug(`mqtt update fired:`)
  console.debug(conditions)
})

function updateOWMConditions() {
  owm.updateStationData(currentConditions)
}

setInterval(updateOWMConditions, 60000)