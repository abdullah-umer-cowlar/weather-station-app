import dotenv from "dotenv";
dotenv.config();

const envConfig = {
  BROKER_HOST: process.env.BROKER_HOST,
  BROKER_PORT: process.env.BROKER_PORT,
  DATA_TOPIC: process.env.DATA_TOPIC,
  CONTROL_TOPIC: process.env.CONTROL_TOPIC,
};

export default envConfig;
