import mqtt from "mqtt";
import dotenv from "dotenv";
import envConfig from "./config/envConfig";
import { getRandomFloat } from "./utils";

dotenv.config();
const client = mqtt.connect(
  `mqtt://${envConfig.BROKER_HOST}:${envConfig.BROKER_PORT}`
);

client.on("connect", () => {
  console.log("Weather publisher successfully connected to mqtt broker.");
  console.log("Starting data publishing...");
  initSimulator();
});

const initSimulator = () => {
  setInterval(() => {
    const randomData = {
      weather_data: {
        temperature: getRandomFloat(10, 40),
        humidity: getRandomFloat(15, 25),
      },
    };
    client.publish(envConfig.TOPIC_NAME, JSON.stringify(randomData), (err) => {
      if (err) {
        console.error("Error publishing data:", err);
      }
    });
  }, 2000);
};

client.on("message", (topic, message) => {
  console.log("New message received.", topic);
  console.log("Topic: ", topic);
  console.log("Content: ", message.toString());
});
