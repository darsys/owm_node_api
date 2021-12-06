require('dotenv').config()
const mqtt = require('mqtt')
const EventEmitter = require("events")
// const wdt = require('../weatherdatatools')
// const config = require('config')
//const owmCondition = require('./owmConditions')


const conditionTopics = {
  temperature: process.env.TOPIC_TEMPERATURE,
  humidity: process.env.TOPIC_HUMIDITY,
  wind_speed: process.env.TOPIC_WIND_SPEED,
  wind_dir: process.env.TOPIC_WIND_DIR,
  rain_1h: process.env.TOPIC_RAIN_1H
}

class mqttClient extends EventEmitter {

  #conditions = Array()
  #client
  #eventTimer

  constructor(mqttConfig = mqttConfig, conditionTopics = conditionTopics) {
    super()
    // var mqttConfig2 = config.get('')
    this.config = {
      mqttConfig:  mqttConfig,
      conditionTopics: conditionTopics
    }
    // console.debug('mqttClient config:', JSON.stringify(this.config, undefined, 2))
    this.topicConditions = Array()
    this.msgCount = 0
    this.createConditions()
    console.debug('mqtt connect')
    this.connect = this.connect.bind(this)
    this.connect()
    // console.debug('configuring mqtt client ...')
    this.configClient = this.configClient.bind(this)
    this.configClient()
  }

  createConditions = () => {
    for (const [condition, topic] of Object.entries(conditionTopics)) {
      console.debug(`mqtt: create condition ${condition} with topic ${topic}`)
      this.#conditions[topic] = (new Condition(condition, topic))
    }
  }

  configClient = () => {
    this.client.on('message', (topic, message) => {
      this.handleMessage(topic,message)
    })
    this.client.on('connect', () => {
      console.log(`mqtt: connected successfully to ${this.config.mqttConfig.host}`)
      this.subscribeToTopics()
    })
    this.client.on('close', function () {
      console.warn('close')
    })
    this.client.on('error', function (error) {
      console.error('ERROR: ', error)
    })
    this.client.on('offline', function () {
      console.warn('offline')
    })
    this.client.on('reconnect', function () {
      console.warn('reconnect')
    })
  }

  connect(host = this.config.mqttConfig.host, options = this.config.mqttConfig.options) {
    console.log(`mqtt attempting to connect to ${host}`)
    this.client = mqtt.connect(host, options)
  }
  
  handleMessage = (topic, message) =>  {
    // reset timer for sending an update (hysterysis for update event)
    clearTimeout(this.#eventTimer)
    this.#eventTimer = setTimeout( this.sendUpdate, 4000 )

    var cond = this.#conditions[topic]
    this.msgCount ++
    var dt = unixDT()
   // if an update to a condition happens within 5 seconds consider it a duplicate
    if (dt < cond.updated + 5) {
      // console.debug(`duplicate message`)
      return
    } else {
      cond.updated = dt
    }

    var currentVal = parseFloat(message.toString())
    this.#conditions[topic].state = currentVal
    // console.debug(`Message: ${topic}   Condition: ${cond.condition}  Value: ${cond.state}`)

  }

  subscribeToTopics() {
    for (const [condition, topic] of Object.entries(conditionTopics)) {
      console.debug(`subscribing to condition: ${condition} with topic: ${topic}`)
      this.client.subscribe(topic, function (err) {
        if (err) {
          console.error('mqtt subscribe error on topic: ' + topic)
          console.errr(err.toString())
        }
      })
    }
  }

  owmConditions = () => {
    var owmC = {}
    for (const [condition, topic] of Object.entries(conditionTopics)) {
      if( typeof this.#conditions[topic].state != 'undefined' )
      owmC[condition] = this.#conditions[topic].state
    }
    return owmC
  }

  sendUpdate = () => {
    var owmC = this.owmConditions()
    // console.debug(`timer expired: sending updated owmConditions: `)
    // console.debug(owmC)
    this.emit('update', owmC)
  }

}


class Condition {
  #condition
  #topic
  #state
  #updated
  #conditionTracker

  constructor(condition, topic, state = undefined, updated=unixDT()) {
    this.#condition = condition
    this.#topic = topic
    this.#state = state
    this.#updated = updated
    // this.#conditionTracker = new wdt.condition_tracker()
  }

  get condition() {
    return this.#condition
  }

  get state() {
    return this.#state
    // return this.#conditionTracker.latest()
  }

  set state(state) {
    // this.#conditionTracker.addObservation(state)
    this.#state = state
    this.#updated = unixDT()
  }

  get topic() {
    return this.#topic
  }

  set topic(topic) {
    this.#topic = topic
  }
  
}


function unixDT () {
  return Math.round(new Date().getTime() / 1000)
}

module.exports = mqttClient