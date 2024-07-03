import mqtt from "mqtt";
import dotenv from "dotenv";
import envConfig from "./config/envConfig";

dotenv.config();
const client = mqtt.connect(
  `mqtt://${envConfig.BROKER_HOST}:${envConfig.BROKER_PORT}`
);

client.on("connect", () => {
  console.log("Weather publisher successfully connected to mqtt broker.");
  initSimulator();
});

const data = {
  weather_data: {
    temperature: 15,
    humidity: 25,
  },
};

const initSimulator = () => {
  setInterval(() => {
    client.publish("test", JSON.stringify(data));
  }, 1000);
};

client.on("message", (topic, message) => {
  // message is Buffer
  console.log("recv topic: ", topic);
  console.log("recv message: ", message.toString());
});
