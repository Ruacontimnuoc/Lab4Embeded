require("dotenv").config();
const mqtt = require("mqtt");

var mqttClient;
var mqttHost = 'test.mosquitto.org';
var mqttPort = "1883";
const protocol = "mqtt";

// Change this to point to your MQTT broker or DNS name
// const username = "phucle";
// const password = "aio_ypjm65RZyBGwvGMygJoWFeaYVOlx";

function connectToBroker() {
  const clientId = "client";

  // Change this to point to your MQTT broker
  const hostURL = `${protocol}://${mqttHost}:${mqttPort}`;

  const options = {
    keepalive: 60,
    clientId: clientId,
    protocolId: "MQTT",
    protocolVersion: 4,
    clean: true,
    reconnectPeriod: 1000,
    connectTimeout: 30 * 1000,
  };

  mqttClient = mqtt.connect(
    hostURL,
    {
      // username: username,
      // password: password
    },
    options
  );

  mqttClient.on("error", (err) => {
    console.log("Error: ", err);
    mqttClient.end();
  });

  mqttClient.on("reconnect", () => {
    console.log("Reconnecting...");
  });

  mqttClient.on("connect", () => {
    console.log("Client connected:" + clientId);
  });

  // Received Message
  mqttClient.on("message", (topic, message, packet) => {
    console.log(
      "Received Message: " + message.toString() + "\nOn topic: " + topic
    );
  });
}

function publishMessage(topic, message) {
  console.log(`Sending Topic: ${topic}, Message: ${message}`);
  mqttClient.publish(topic, message, {
    qos: 0,
    retain: false,
  });
}

const data = {
  station_id: "air_0001",
  station_name: "AIR 0001",
  gps_longitude: 106.89,
  gps_latitude: 10.5,
  sensors: [
    {
      sensor_id: "temp_0001",
      sensor_name: "Nhiệt Độ",
      sensor_value: 112.3,
      sensor_unit: "ms/cm",
    },
    {
      sensor_id: "humi_0001",
      sensor_name: "Độ Ẩm",
      sensor_value: 73.5,
      sensor_unit: "%",
    },
    {
      sensor_id: "illuminance_0001",
      sensor_name: "Độ Sáng",
      sensor_value: 112.3,
      sensor_unit: "lux",
    },
    {
      sensor_id: "CO2_0001",
      sensor_name: "CO2",
      sensor_value: 400.3,
      sensor_unit: "ppm",
    },
  ],
};
const jsondata = JSON.stringify(data);

connectToBroker();
// setInterval(publishMessage(`${username}/feeds/Temp`, "32"), 5000);
setInterval(() => {
  // const topic = `${username}/feeds/Temp`;
  const topic = `feeds/Temp`;
  // const message = Math.floor(Math.random() * 100).toString();
  publishMessage(topic, jsondata);
}, 4000);
