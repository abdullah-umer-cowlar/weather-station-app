import express, { Application } from "express";
import { routes } from "./routes";
import { sequelize } from "./config/postgresConn";
import { initMqtt } from "./config/mqttConn";
import cors from "cors";
import envConfig from "./config/envConfig";
import { Point } from "@influxdata/influxdb-client";
import { writeApi } from "./config/influxConn";
import { MqttClient } from "mqtt";

const PORT = envConfig.PORT || 3000;
const app: Application = express();

app.use(express.json());
app.use(cors());
app.use("/api", routes);

const initPostgres = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");
  } catch (error) {
    console.error("Error initializing postgres connection:", error);
  }
};

const initInfluxWrites = (mqttClient: MqttClient) => {
  mqttClient.on("message", (topic, message) => {
    console.log("New message received.");
    console.log("Topic: ", topic);
    console.log("Content: ", message.toString());
    // do we really need this check ? maybe if there are more than one topics, but rn there's only one that is subscribed to
    if (topic === envConfig.DATA_TOPIC) {
      try {
        const weatherDataObj = JSON.parse(message.toString());
        console.log(weatherDataObj);
        if (
          !weatherDataObj.weather_data ||
          !weatherDataObj.weather_data.temperature ||
          !weatherDataObj.weather_data.humidity
        ) {
          throw new Error("Received invalid weather data object.");
        }
        // hardcoded location tag for now, can later make dynamic based on data object when add mutliple locations
        const newPoint = new Point("weather")
          .tag("location", "Islamabad")
          .floatField("temperature", weatherDataObj.weather_data.temperature)
          .floatField("humidity", weatherDataObj.weather_data.humidity);
        writeApi.writePoint(newPoint);
        console.log(`Written a new point record: ${newPoint}`);
      } catch (err) {
        console.error("Error while processing received message:", err);
      }
    }
  });
};

const startServer = () => {
  initPostgres();
  app.listen(PORT, () => {
    console.log("Server listening on port", PORT);
  });
  const mqttClient = initMqtt();
  mqttClient.on("error", (err) => {
    console.error("Error in mqtt client: ", err);
  });

  mqttClient.on("connect", () => {
    console.log("Backend successfully connected to mqtt broker.");
    console.log("Subscribing to wsa topic...");
    mqttClient.subscribe(envConfig.DATA_TOPIC!, (err) => {
      if (err) {
        console.error("Error subscribing to wsa topic:", err);
      }
    });
  });
  initInfluxWrites(mqttClient);
};

startServer();
