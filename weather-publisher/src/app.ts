import mqtt from "mqtt";
import envConfig from "./config/envConfig";
import { getRandomFloat } from "./utils";

const client = mqtt.connect(
  `mqtt://${envConfig.BROKER_HOST}:${envConfig.BROKER_PORT}`
);

let publishTimer = null;

client.on("error", (err) => {
  console.error("Error in mqtt client: ", err);
});

client.on("connect", () => {
  console.log("Weather publisher successfully connected to mqtt broker.");
  console.log("Subscribing to control topic...");
  // put this topic in an envar
  client.subscribe("wsa/control", (err) => {
    if (err) {
      console.error("Error subscribing to control topic:", err);
    }
  });
  console.log("Starting data publishing...");
  initSimulator();
});

// fine being QoS 1 i think
const initSimulator = () => {
  publishTimer = setInterval(() => {
    const randomData = {
      weather_data: {
        temperature: getRandomFloat(10, 40),
        humidity: getRandomFloat(15, 25),
      },
    };
    client.publish(envConfig.DATA_TOPIC, JSON.stringify(randomData), (err) => {
      if (err) {
        console.error("Error publishing data:", err);
      }
    });
  }, 2000);
};

// this needs to be QoS 2
client.on("message", (topic, message) => {
  console.log("New message received.");
  console.log("Topic: ", topic);
  console.log("Content: ", message.toString());
  // do we really need this check ? maybe if there are more than one topics, but rn there's only one that is subscribed to
  if (topic === envConfig.CONTROL_TOPIC) {
    try {
      const data = JSON.parse(message.toString());
      if (!data.command) {
        throw new Error("Invalid data, command not found.");
      }
      if (data.command === "start") {
        initSimulator();
      } else if (data.command === "stop") {
        clearInterval(publishTimer);
      } else {
        throw new Error("Invalid command.");
      }
    } catch (err) {
      console.error("Error while processing received message:", err);
    }
  }
});
