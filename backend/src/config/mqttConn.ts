import envConfig from "./envConfig";
import mqtt from "mqtt";

export const initMqtt = () => {
  return mqtt.connect(
    `mqtt://${envConfig.BROKER_HOST}:${envConfig.BROKER_PORT}`
  );
};
