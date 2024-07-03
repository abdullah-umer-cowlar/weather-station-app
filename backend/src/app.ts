import express, { Application } from "express";
import { routes } from "./routes";
import { sequelize } from "./config/db";
import cors from "cors";
import envConfig from "./config/envConfig";
import mqtt from "mqtt";

const PORT = envConfig.PORT || 3000;
const app: Application = express();

app.use(express.json());
app.use(cors());
app.use("/api", routes);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");
    app.listen(PORT, () => {
      console.log("Server listening on port", PORT);
    });
  } catch (error) {
    console.error("Error initializing server:", error);
  }
};

startServer();

const mqttClient = mqtt.connect(
  `mqtt://${envConfig.BROKER_HOST}:${envConfig.BROKER_PORT}`
);

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
